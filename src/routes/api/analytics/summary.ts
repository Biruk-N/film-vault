import { createServerFileRoute } from '@tanstack/react-start/server'
import { json } from '@tanstack/react-start'
import { visitMiddleware } from '../_visitMiddleware'
import { getVisitSummary } from '~/lib/database'
import { ok, err } from '~/lib/api-response'

export const ServerRoute = createServerFileRoute('/api/analytics/summary')
  .middleware([visitMiddleware])
  .methods({
    GET: async ({ request }) => {
      const url = new URL(request.url)
      const from = url.searchParams.get('from') || undefined
      const to = url.searchParams.get('to') || undefined
      try {
        const data = getVisitSummary(from, to)
        return json(ok(data))
      } catch (e: any) {
        return json(err('SERVER_ERROR', e?.message || 'Failed to load summary'))
      }
    },
  })
