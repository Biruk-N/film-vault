import { createFileRoute } from '@tanstack/react-router'
import * as React from 'react'

type Summary = {
  total: number
  byRoute: Array<{ route: string; count: number }>
  byDay: Array<{ day: string; count: number }>
}

export const Route = createFileRoute('/__admin/analytics')({
  component: AnalyticsPage,
})

function AnalyticsPage() {
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [summary, setSummary] = React.useState<Summary | null>(null)

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
        return body.data as Summary
      })
      .then((data) => {
        setSummary(data)
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
      {summary && (
        <>
          <p>
            Total visits: <b>{summary.total}</b>
          </p>
          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
            <section>
              <h2>By Route</h2>
              <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                  <tr>
                    <th style={th}>Route</th>
                    <th style={th}>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.byRoute.map((r) => (
                    <tr key={r.route}>
                      <td style={td}>{r.route}</td>
                      <td style={td}>{r.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
            <section>
              <h2>By Day</h2>
              <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                  <tr>
                    <th style={th}>Day</th>
                    <th style={th}>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.byDay.map((d) => (
                    <tr key={d.day}>
                      <td style={td}>{d.day}</td>
                      <td style={td}>{d.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>
        </>
      )}
    </div>
  )
}

const th: React.CSSProperties = { background: '#f5f5f5', textAlign: 'left', border: '1px solid #ddd', padding: 8 }
const td: React.CSSProperties = { border: '1px solid #ddd', padding: 8 }
