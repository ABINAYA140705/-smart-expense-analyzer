import { useEffect, useState } from 'react'
import axios from 'axios'

const API = 'https://smart-expense-api-7i7d.onrender.com/'
const CATEGORIES = ['Food','Travel','Shopping','Education','Health','Entertainment','Utilities','Other']
const CAT_ICONS  = { Food:'🍕', Travel:'🚌', Shopping:'🛍', Education:'📚', Health:'💊', Entertainment:'🎬', Utilities:'📱', Other:'◎' }

function ProgressBar({ spent, limit }) {
  const pct = Math.min((spent / limit) * 100, 100)
  const color = pct >= 100 ? 'var(--rose)' : pct >= 80 ? 'var(--amber)' : 'var(--teal)'
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: '.75rem' }}>
        <span style={{ color: 'var(--muted)' }}>₹{spent.toLocaleString()} spent</span>
        <span style={{ color, fontWeight: 600 }}>{pct.toFixed(0)}%</span>
      </div>
      <div style={{ height: 7, background: 'var(--surface2)', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 10, transition: 'width .6s ease', boxShadow: pct >= 100 ? `0 0 8px ${color}` : 'none' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: '.72rem', color: 'var(--muted)' }}>
        <span>Limit: ₹{limit.toLocaleString()}</span>
        <span style={{ color: pct >= 100 ? 'var(--rose)' : 'var(--muted)' }}>
          {pct >= 100 ? `Over by ₹${(spent - limit).toLocaleString()}` : `₹${(limit - spent).toLocaleString()} left`}
        </span>
      </div>
    </div>
  )
}

export default function Budget() {
  const [budgets,  setBudgets]  = useState([])
  const [summary,  setSummary]  = useState({})
  const [selected, setSelected] = useState('Food')
  const [limit,    setLimit]    = useState('')
  const [status,   setStatus]   = useState(null)
  const [loading,  setLoading]  = useState(true)

  const load = async () => {
    const [b, s] = await Promise.all([
      axios.get(`${API}/budgets`),
      axios.get(`${API}/summary`),
    ])
    setBudgets(b.data)
    const sm = {}
    s.data.forEach(x => sm[x.category] = x.amount)
    setSummary(sm)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleSet = async () => {
    const lim = parseFloat(limit)
    if (!limit || isNaN(lim) || lim <= 0) return
    await axios.post(`${API}/budgets`, { category: selected, monthly_limit: lim })
    setStatus('success'); setLimit('')
    setTimeout(() => setStatus(null), 2500)
    load()
  }

  const budgetMap = {}
  budgets.forEach(b => budgetMap[b.category] = b.monthly_limit)

  const setBudgetCategories = budgets.map(b => b.category)
  const allCategories = [...new Set([...setBudgetCategories, ...Object.keys(summary)])]

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '2rem 1.5rem' }}>

      {/* Header */}
      <div className="fade-up" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, letterSpacing: '-.03em' }}>
          Budget <span style={{ color: 'var(--amber)' }}>Limits</span>
        </h1>
        <p style={{ color: 'var(--muted)', marginTop: 4, fontSize: '.875rem' }}>Set monthly spending limits and get alerts when you exceed them</p>
      </div>

      {/* Set Budget Form */}
      <div className="card fade-up-1" style={{ padding: '24px', marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>Set Monthly Budget</h2>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setSelected(c)} className={`chip ${selected === c ? 'active-amber' : ''}`}>
              {CAT_ICONS[c]} {c}
              {budgetMap[c] && <span style={{ marginLeft: 4, fontSize: '.65rem', opacity: .7 }}>₹{budgetMap[c].toLocaleString()}</span>}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '.72rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.07em', display: 'block', marginBottom: 6 }}>
              Monthly Limit for {selected} (₹)
            </label>
            <input type="number" className="inp" placeholder="e.g. 3000"
              value={limit} onChange={e => setLimit(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSet()} />
          </div>
          <button className="btn-primary" onClick={handleSet} style={{ whiteSpace: 'nowrap', padding: '11px 24px' }}>
            Set Limit
          </button>
        </div>

        {status === 'success' && (
          <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 10, background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.2)', color: 'var(--teal)', fontSize: '.84rem' }}>
            ✓ Budget for {selected} updated! AI insights will now include alerts.
          </div>
        )}
      </div>

      {/* Budget Progress Cards */}
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, marginBottom: 14, color: 'var(--muted)' }}>
        THIS MONTH'S PROGRESS
      </h2>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[1,2,3,4].map(i => <div key={i} className="card" style={{ padding: 20, height: 120, animation: 'shimmer 1.4s infinite' }} />)}
        </div>
      ) : budgets.length === 0 ? (
        <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
          <p style={{ fontSize: '2rem', marginBottom: 10 }}>◎</p>
          <p style={{ color: 'var(--muted)', fontSize: '.9rem' }}>No budgets set yet.</p>
          <p style={{ color: 'var(--muted)', fontSize: '.8rem', marginTop: 4 }}>Select a category above and set a monthly limit.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
          {budgets.map((b, i) => {
            const spent = summary[b.category] || 0
            const pct   = (spent / b.monthly_limit) * 100
            const isOver = pct >= 100
            const isWarn = pct >= 80 && !isOver
            return (
              <div key={b.category} className="card fade-up" style={{
                padding: '20px',
                borderColor: isOver ? 'rgba(255,94,125,0.3)' : isWarn ? 'rgba(255,179,71,0.3)' : 'var(--border)',
                animation: `fadeUp .4s ${i * 0.06}s ease both`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '1.2rem' }}>{CAT_ICONS[b.category] || '◎'}</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '.95rem' }}>{b.category}</span>
                  </div>
                  {isOver && <span style={{ fontSize: '.65rem', background: 'var(--rose-dim)', color: 'var(--rose)', padding: '3px 8px', borderRadius: 6, fontWeight: 700, letterSpacing: '.05em' }}>EXCEEDED</span>}
                  {isWarn && <span style={{ fontSize: '.65rem', background: 'var(--amber-dim)', color: 'var(--amber)', padding: '3px 8px', borderRadius: 6, fontWeight: 700, letterSpacing: '.05em' }}>WARNING</span>}
                  {!isOver && !isWarn && <span style={{ fontSize: '.65rem', background: 'rgba(0,212,170,0.08)', color: 'var(--teal)', padding: '3px 8px', borderRadius: 6, fontWeight: 700, letterSpacing: '.05em' }}>ON TRACK</span>}
                </div>
                <ProgressBar spent={spent} limit={b.monthly_limit} />
              </div>
            )
          })}
        </div>
      )}

      {/* No budget categories with spending */}
      {!loading && allCategories.filter(c => !budgetMap[c] && summary[c]).length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, marginBottom: 10, color: 'var(--muted)' }}>
            SPENDING WITHOUT LIMITS
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {allCategories.filter(c => !budgetMap[c] && summary[c]).map(c => (
              <div key={c} onClick={() => setSelected(c)} style={{
                background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10,
                padding: '10px 16px', cursor: 'pointer', transition: 'all .15s',
                display: 'flex', alignItems: 'center', gap: 8,
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--amber)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <span>{CAT_ICONS[c] || '◎'}</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '.84rem', color: 'var(--text)' }}>{c}</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '.84rem', color: 'var(--amber)', fontWeight: 700 }}>₹{summary[c].toLocaleString()}</span>
                <span style={{ fontSize: '.7rem', color: 'var(--muted)' }}>→ set limit</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
