import Database from 'better-sqlite3'
import path from 'path'
import crypto from 'crypto'
import fs from 'fs'
import os from 'os'
import { fileURLToPath } from 'url'

// Database interface
export interface Movie {
  id: number
  title: string
  imdb_url: string
  poster_url: string
}

// Initialize database
let db: Database.Database | null = null

function ensureTmpDbPath(): string {
  const dst = path.join(os.tmpdir(), 'movies.db')

  if (fs.existsSync(dst)) return dst

  // Resolve source path robustly for Netlify/Nitro bundles
  const moduleDir = path.dirname(fileURLToPath(import.meta.url))
  const candidates = [
    path.join(process.cwd(), 'data', 'movies.db'),
    path.join(moduleDir, '../../data/movies.db'),
    path.join(moduleDir, '../data/movies.db'),
    path.join(moduleDir, '../../../data/movies.db'),
    process.env.LAMBDA_TASK_ROOT ? path.join(process.env.LAMBDA_TASK_ROOT, 'data', 'movies.db') : '',
  ].filter(Boolean) as string[]

  const src = candidates.find((p) => p && fs.existsSync(p))
  if (!src) {
    // No bundled DB found. We'll create a fresh DB at /tmp and optionally seed from movies.sql later.
    return dst
  }

  fs.copyFileSync(src, dst)
  return dst
}

function findDataFile(filename: string): string | null {
  const moduleDir = path.dirname(fileURLToPath(import.meta.url))
  const candidates = [
    path.join(process.cwd(), 'data', filename),
    path.join(moduleDir, '../../data', filename),
    path.join(moduleDir, '../data', filename),
    path.join(moduleDir, '../../../data', filename),
    process.env.LAMBDA_TASK_ROOT ? path.join(process.env.LAMBDA_TASK_ROOT, 'data', filename) : '',
  ].filter(Boolean) as string[]
  return candidates.find((p) => fs.existsSync(p)) || null
}

export function getDatabase(): Database.Database {
  if (!db) {
    const dbPath = ensureTmpDbPath()
    db = new Database(dbPath)
    
    // Enable WAL mode for better performance
    db.pragma('journal_mode = WAL')

    // Ensure visits table exists
    db.prepare(
      `CREATE TABLE IF NOT EXISTS visits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ts DATETIME DEFAULT CURRENT_TIMESTAMP,
        route TEXT NOT NULL,
        method TEXT NOT NULL,
        status INTEGER NOT NULL,
        ip_hash TEXT,
        user_agent TEXT,
        referrer TEXT,
        session_id TEXT,
        user_id TEXT,
        meta TEXT
      )`
    ).run()

    // Ensure movies table exists; if empty and we have a seed SQL, seed it
    db.prepare(
      `CREATE TABLE IF NOT EXISTS movies (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        imdb_url TEXT NOT NULL,
        poster_url TEXT NOT NULL
      )`
    ).run()

    try {
      const countRow = db.prepare(`SELECT COUNT(*) as count FROM movies`).get() as { count: number }
      if (!countRow || countRow.count === 0) {
        const seedPath = findDataFile('movies.sql')
        if (seedPath) {
          const sql = fs.readFileSync(seedPath, 'utf-8')
          db.exec(sql)
        }
      }
    } catch (e) {
      // Best-effort seeding; ignore if something goes wrong
      console.warn('Movies seed skipped:', (e as Error)?.message)
    }
  }
  return db
}

// Database queries
export function getAllMovies(): Movie[] {
  const database = getDatabase()
  return database.prepare('SELECT * FROM movies ORDER BY id').all() as Movie[]
}

export function getMovieById(id: number): Movie | undefined {
  const database = getDatabase()
  return database.prepare('SELECT * FROM movies WHERE id = ?').get(id) as Movie | undefined
}

export function searchMovies(query: string): Movie[] {
  const database = getDatabase()
  const searchTerm = `%${query}%`
  return database.prepare('SELECT * FROM movies WHERE title LIKE ? ORDER BY id').all(searchTerm) as Movie[]
}

export function getMoviesByLimit(limit: number, offset: number = 0): Movie[] {
  const database = getDatabase()
  return database.prepare('SELECT * FROM movies ORDER BY id LIMIT ? OFFSET ?').all(limit, offset) as Movie[]
}

export function getTotalMovieCount(): number {
  const database = getDatabase()
  const result = database.prepare('SELECT COUNT(*) as count FROM movies').get() as { count: number }
  return result.count
}

// Close database connection
export function closeDatabase(): void {
  if (db) {
    db.close()
    db = null
  }
}

// Analytics/Visits
export interface VisitInput {
  route: string
  method: string
  status: number
  ip?: string | null
  userAgent?: string | null
  referrer?: string | null
  sessionId?: string | null
  userId?: string | null
  meta?: Record<string, unknown> | null
}

export interface VisitSummary {
  total: number
  byRoute: Array<{ route: string; count: number }>
  byDay: Array<{ day: string; count: number }>
}

function hashIp(ip: string | null | undefined): string | null {
  if (!ip) return null
  const salt = process.env.ADMIN_IP_SALT || 'film-vault'
  return crypto.createHash('sha256').update(ip + ':' + salt).digest('hex')
}

export function recordVisit(input: VisitInput): number {
  const database = getDatabase()
  const stmt = database.prepare(
    `INSERT INTO visits (route, method, status, ip_hash, user_agent, referrer, session_id, user_id, meta)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
  const info = stmt.run(
    input.route,
    input.method,
    input.status,
    hashIp(input.ip || null),
    input.userAgent || null,
    input.referrer || null,
    input.sessionId || null,
    input.userId || null,
    input.meta ? JSON.stringify(input.meta) : null,
  )
  return Number(info.lastInsertRowid)
}

export function getVisitSummary(from?: string, to?: string): VisitSummary {
  const database = getDatabase()
  // Total
  const total = (database.prepare(
    `SELECT COUNT(*) as count FROM visits
     WHERE (? IS NULL OR ts >= ?)
       AND (? IS NULL OR ts <= ?)`
  ).get(from ?? null, from ?? null, to ?? null, to ?? null) as { count: number }).count

  // By route
  const byRoute = database.prepare(
    `SELECT route, COUNT(*) as count FROM visits
     WHERE (? IS NULL OR ts >= ?)
       AND (? IS NULL OR ts <= ?)
     GROUP BY route
     ORDER BY count DESC`
  ).all(from ?? null, from ?? null, to ?? null, to ?? null) as Array<{ route: string; count: number }>

  // By day
  const byDay = database.prepare(
    `SELECT strftime('%Y-%m-%d', ts) as day, COUNT(*) as count FROM visits
     WHERE (? IS NULL OR ts >= ?)
       AND (? IS NULL OR ts <= ?)
     GROUP BY day
     ORDER BY day DESC`
  ).all(from ?? null, from ?? null, to ?? null, to ?? null) as Array<{ day: string; count: number }>

  return { total, byRoute, byDay }
}

export function getUserAgentBreakdown(from?: string, to?: string): Array<{ userAgent: string | null; count: number }> {
  const database = getDatabase()
  const rows = database.prepare(
    `SELECT user_agent as userAgent, COUNT(*) as count FROM visits
     WHERE (? IS NULL OR ts >= ?)
       AND (? IS NULL OR ts <= ?)
     GROUP BY user_agent
     ORDER BY count DESC`
  ).all(from ?? null, from ?? null, to ?? null, to ?? null) as Array<{ userAgent: string | null; count: number }>
  return rows
}

export function getVisits(limit = 50, offset = 0) {
  const database = getDatabase()
  return database.prepare(
    `SELECT id, ts, route, method, status, ip_hash as ipHash, user_agent as userAgent,
            referrer, session_id as sessionId, user_id as userId, meta
     FROM visits
     ORDER BY ts DESC
     LIMIT ? OFFSET ?`
  ).all(limit, offset)
}