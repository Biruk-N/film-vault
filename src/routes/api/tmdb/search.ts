import { createServerFileRoute } from '@tanstack/react-start/server'
import { json } from '@tanstack/react-start'
import { visitMiddleware } from '../_visitMiddleware'
import { searchMovies } from '~/lib/secure-tmdb-api'
import { ok, err } from '~/lib/api-response'

export const ServerRoute = createServerFileRoute('/api/tmdb/search')
  .middleware([visitMiddleware])
  .methods({
    GET: async ({ request }) => {
      const url = new URL(request.url)
      const query = url.searchParams.get('query')?.trim() || ''
      if (!query) {
        return json(err('VALIDATION_ERROR', 'Missing query parameter', { query }))
      }
      try {
        const t0 = Date.now()
        const results = await searchMovies(query)
        return json(ok({ results, page: 1, total_pages: 1, total_results: results.length }, { source: 'tmdb', took_ms: Date.now() - t0 }))
      } catch (e: any) {
        return json(err('UPSTREAM_ERROR', e?.message || 'TMDB error'))
      }
    },
  })
