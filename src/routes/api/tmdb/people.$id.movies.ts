import { createServerFileRoute } from '@tanstack/react-start/server'
import { json } from '@tanstack/react-start'
import { visitMiddleware } from '../_visitMiddleware'
import { getMovieDetails, getPersonCombinedCredits, type TMDBMovie } from '~/lib/secure-tmdb-api'
import { ok, err } from '~/lib/api-response'

interface FilmographyItem extends TMDBMovie {
  role?: string
  department?: string
}

export const ServerRoute = createServerFileRoute('/api/tmdb/people/$id/movies')
  .middleware([visitMiddleware])
  .methods({
    GET: async ({ params, request }) => {
      const id = Number(params.id)
      if (!Number.isFinite(id)) {
        return json(err('VALIDATION_ERROR', 'Invalid id'))
      }

      const url = new URL(request.url)
      const page = Math.max(1, Number(url.searchParams.get('page') || '1'))
      const perPage = Math.min(50, Math.max(1, Number(url.searchParams.get('perPage') || '20')))
      const type = (url.searchParams.get('type') || 'all') as 'all' | 'cast' | 'crew'

      try {
        const t0 = Date.now()
        const credits = await getPersonCombinedCredits(id)
        if (!credits) return json(err('NOT_FOUND', 'Credits not found'))

        // Merge cast and crew, filter to movies only
        let items = [
          ...(type === 'crew' ? [] : credits.cast),
          ...(type === 'cast' ? [] : credits.crew),
        ].filter((c: any) => c.media_type === 'movie') as Array<any>

        // Dedupe by movie id keeping first occurrence (prefer cast credit if both exist)
        const map = new Map<number, { id: number; role?: string; department?: string; popularity?: number; release_date?: string; poster_path?: string | null }>()
        for (const it of items) {
          if (!map.has(it.id)) {
            const role = it.character || it.job
            map.set(it.id, {
              id: it.id,
              role,
              department: it.department,
              popularity: it.popularity,
              release_date: it.release_date,
              poster_path: it.poster_path ?? null,
            })
          }
        }

        // Sort by release_date desc then popularity desc
        const sorted = Array.from(map.values()).sort((a, b) => {
          const da = a.release_date ? Date.parse(a.release_date) : 0
          const db = b.release_date ? Date.parse(b.release_date) : 0
          if (db !== da) return db - da
          const pa = a.popularity ?? 0
          const pb = b.popularity ?? 0
          return pb - pa
        })

        const total_results = sorted.length
        const total_pages = Math.max(1, Math.ceil(total_results / perPage))
        const start = (page - 1) * perPage
        const slice = sorted.slice(start, start + perPage)

        // Fetch details for the page slice and merge
        const detailed: FilmographyItem[] = []
        for (const entry of slice) {
          const details = await getMovieDetails(entry.id)
          if (details) {
            detailed.push({ ...details, role: entry.role, department: entry.department })
          }
        }

        return json(
          ok(
            {
              page,
              total_pages,
              total_results,
              results: detailed,
            },
            { source: 'tmdb', took_ms: Date.now() - t0 }
          )
        )
      } catch (e: any) {
        return json(err('UPSTREAM_ERROR', e?.message || 'TMDB error'))
      }
    },
  })
