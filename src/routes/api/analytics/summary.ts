import { createServerFileRoute } from '@tanstack/react-start/server'
import { json } from '@tanstack/react-start'
import { visitMiddleware } from '../_visitMiddleware'
import { getVisitSummary, getUserAgentBreakdown } from '~/lib/database'
import { ok, err } from '~/lib/api-response'

export const ServerRoute = createServerFileRoute('/api/analytics/summary')
  .middleware([visitMiddleware])
  .methods({
    GET: async ({ request }) => {
      const url = new URL(request.url)
      const from = url.searchParams.get('from') || undefined
      const to = url.searchParams.get('to') || undefined
      try {
        const range = getVisitSummary(from, to)
        const rangeUserAgents = getUserAgentBreakdown(from, to)
        const allTime = getVisitSummary()
        const allTimeUserAgents = getUserAgentBreakdown()
        const data = {
          range: { ...range, userAgents: rangeUserAgents },
          allTime: { ...allTime, userAgents: allTimeUserAgents },
        }
        return json(ok(data))
      } catch (e: any) {
        return json(err('SERVER_ERROR', e?.message || 'Failed to load summary'))
      }
    },
  })
