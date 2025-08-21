import { createFileRoute } from '@tanstack/react-router'
import * as React from 'react'

type CountRow = { count: number }
type RouteRow = { route: string; count: number }
type DayRow = { day: string; count: number }
type UARow = { userAgent: string | null; count: number }
type Summary = {
  total: number
  byRoute: RouteRow[]
  byDay: DayRow[]
  userAgents: UARow[]
}
type ApiData = {
  range: Summary
  allTime: Summary
}

export const Route = createFileRoute('/__admin/analytics')({
  component: AnalyticsPage,
})

function AnalyticsPage() {
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [data, setData] = React.useState<ApiData | null>(null)

  React.useEffect(() => {
    const url = new URL(window.location.href)
    const from = url.searchParams.get('from')
    const to = url.searchParams.get('to')
    const qs = new URLSearchParams()
    if (from) qs.set('from', from)
    if (to) qs.set('to', to)

    fetch(`/api/analytics/summary${qs.toString() ? `?${qs.toString()}` : ''}`)
      .then(async (res) => {
        const body = await res.json()
        if (!res.ok || !body.success) {
          throw new Error(body?.error?.message || `HTTP ${res.status}`)
        }
        return body.data as ApiData
      })
      .then((data) => {
        setData(data)
        setLoading(false)
      })
      .catch((e: any) => {
        setError(e?.message || 'Failed to load analytics')
        setLoading(false)
      })
  }, [])

  return (
    <div style={{ fontFamily: 'system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif', padding: 24 }}>
      <h1 style={{ margin: '0 0 12px' }}>Analytics Summary</h1>
      {loading && <p>Loading…</p>}
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      {data && (
        <>
          <Section title="Current Range">
            <SummaryTables s={data.range} />
          </Section>
          <Section title="All Time">
            <SummaryTables s={data.allTime} />
          </Section>
        </>
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 24 }}>
      <h2 style={{ margin: '12px 0' }}>{title}</h2>
      {children}
    </section>
  )
}

function SummaryTables({ s }: { s: Summary }) {
  return (
    <>
      <p>
        Total visits: <b>{s.total}</b>
      </p>
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        <section>
          <h3>By Route</h3>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th style={th}>Route</th>
                <th style={th}>Count</th>
              </tr>
            </thead>
            <tbody>
              {s.byRoute.map((r) => (
                <tr key={r.route}>
                  <td style={td}>{r.route}</td>
                  <td style={td}>{r.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section>
          <h3>By Day</h3>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th style={th}>Day</th>
                <th style={th}>Count</th>
              </tr>
            </thead>
            <tbody>
              {s.byDay.map((d) => (
                <tr key={d.day}>
                  <td style={td}>{d.day}</td>
                  <td style={td}>{d.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section>
          <h3>User Agents</h3>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th style={th}>User Agent</th>
                <th style={th}>Count</th>
              </tr>
            </thead>
            <tbody>
              {s.userAgents.map((ua, i) => (
                <tr key={`${ua.userAgent ?? 'unknown'}-${i}`}>
                  <td style={td}>
                    {ua.userAgent ? (
                      <span title={ua.userAgent}>
                        {ua.userAgent.length > 64 ? ua.userAgent.slice(0, 64) + '…' : ua.userAgent}
                      </span>
                    ) : (
                      <em>unknown</em>
                    )}
                  </td>
                  <td style={td}>{ua.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </>
  )
}

const th: React.CSSProperties = { background: '#f5f5f5', textAlign: 'left', border: '1px solid #ddd', padding: 8 }
const td: React.CSSProperties = { border: '1px solid #ddd', padding: 8 }
