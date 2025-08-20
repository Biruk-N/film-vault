import { createMiddleware } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { recordVisit } from '~/lib/database'

function getClientIp(): string | null {
  // Prefer x-forwarded-for when behind proxy
  const headers = getRequestHeaders()
  const xff = headers['x-forwarded-for'] as string | undefined
  if (xff) {
    const first = xff.split(',')[0]?.trim()
    return first || null
  }
  return (headers['x-real-ip'] as string | undefined) || null
}

function getUserAgent(): string | null {
  const headers = getRequestHeaders()
  return (headers['user-agent'] as string | undefined) || null
}

function getReferrer(): string | null {
  const headers = getRequestHeaders()
  return (headers['referer'] as string | undefined) || null
}

function makeSessionId() {
  return 'anon_' + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
}

export const visitMiddleware = createMiddleware({ type: 'request' }).server(async ({ next, request }) => {
  // Session cookie
  const cookieName = 'sid'
  const incomingCookie = request.headers.get('cookie') || ''
  const match = incomingCookie.match(/(?:^|; )sid=([^;]+)/)
  const sid = match?.[1] ?? makeSessionId()

  const t0 = Date.now()
  const result = await next()
  const status = result.response.status
  const duration = Date.now() - t0

  // Set cookie if new
  if (!match) {
    result.response.headers.append('Set-Cookie', `${cookieName}=${sid}; Path=/; HttpOnly; SameSite=Lax`)
  }

  try {
    recordVisit({
      route: new URL(request.url).pathname,
      method: request.method,
      status,
      ip: getClientIp(),
      userAgent: getUserAgent(),
      referrer: getReferrer(),
      sessionId: sid,
      userId: null,
      meta: { durationMs: duration },
    })
  } catch (e) {
    console.error('Failed to record visit', e)
  }

  return result
})
