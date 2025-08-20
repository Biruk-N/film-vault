import { createServerFileRoute } from '@tanstack/react-start/server'
import { json } from '@tanstack/react-start'
import { visitMiddleware } from '../_visitMiddleware'
import { getTrendingMovies } from '~/lib/secure-tmdb-api'
import { ok, err } from '~/lib/api-response'

export const ServerRoute = createServerFileRoute('/api/tmdb/movies/trending')
  .middleware([visitMiddleware])
  .methods({
    GET: async ({ request }) => {
      const url = new URL(request.url)
      const page = parseInt(url.searchParams.get('page') || '1', 10)
      const timeWindow = (url.searchParams.get('timeWindow') as 'day' | 'week') || 'day'
      try {
        const t0 = Date.now()
        const data = await getTrendingMovies(timeWindow, page)
        return json(ok(data, { source: 'tmdb', took_ms: Date.now() - t0 }))
      } catch (e: any) {
        return json(err('UPSTREAM_ERROR', e?.message || 'TMDB error'))
      }
    },
  })
