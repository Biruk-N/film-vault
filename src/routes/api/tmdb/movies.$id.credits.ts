import { createServerFileRoute } from '@tanstack/react-start/server'
import { json } from '@tanstack/react-start'
import { visitMiddleware } from '../_visitMiddleware'
import { getMovieCredits } from '~/lib/secure-tmdb-api'
import { ok, err } from '~/lib/api-response'

export const ServerRoute = createServerFileRoute('/api/tmdb/movies/$id/credits')
  .middleware([visitMiddleware])
  .methods({
    GET: async ({ params }) => {
      const id = Number(params.id)
      if (!Number.isFinite(id)) {
        return json(err('VALIDATION_ERROR', 'Invalid id'))
      }
      try {
        const t0 = Date.now()
        const data = await getMovieCredits(id)
        if (!data) return json(err('NOT_FOUND', 'Credits not found'))
        return json(ok(data, { source: 'tmdb', took_ms: Date.now() - t0 }))
      } catch (e: any) {
        return json(err('UPSTREAM_ERROR', e?.message || 'TMDB error'))
      }
    },
  })
