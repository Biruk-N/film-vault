import Database from 'better-sqlite3'
import path from 'path'

// Database interface
export interface Movie {
  id: number
  title: string
  imdb_url: string
  poster_url: string
}

// Initialize database
let db: Database.Database | null = null

export function getDatabase(): Database.Database {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'data', 'movies.db')
    db = new Database(dbPath)
    
    // Enable WAL mode for better performance
    db.pragma('journal_mode = WAL')
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