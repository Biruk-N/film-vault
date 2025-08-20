import { createServerFileRoute } from '@tanstack/react-start/server'
import { json } from '@tanstack/react-start'
import { visitMiddleware } from '../_visitMiddleware'
import { recordVisit } from '~/lib/database'
import { ok, err } from '~/lib/api-response'

export const ServerRoute = createServerFileRoute('/api/analytics/visit')
  .middleware([visitMiddleware])
  .methods({
    POST: async ({ request }) => {
      try {
        const payload = await request.json().catch(() => ({}))
        const id = recordVisit({
          route: payload.path || new URL(request.url).pathname,
          method: 'POST',
          status: 200,
          ip: null, // rely on middleware/server-side
          userAgent: null,
          referrer: payload.referrer || null,
          sessionId: payload.sessionId || null,
          userId: null,
          meta: { type: payload.type || 'event', movieId: payload.movieId ?? null },
        })
        return json(ok({ id }))
      } catch (e: any) {
        return json(err('SERVER_ERROR', e?.message || 'Failed to record visit'))
      }
    },
  })
