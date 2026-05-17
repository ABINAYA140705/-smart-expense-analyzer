import { useEffect, useState } from 'react'
import axios from 'axios'
import { CategoryPieChart, CategoryBarChart } from '../components/ExpenseChart'
import InsightCard from '../components/InsightCard'

const API = 'https://smart-expense-api-7i7d.onrender.com/'
const COLORS = ['#00d4aa','#ffb347','#ff5e7d','#4fa3ff','#a78bfa','#34d399','#f472b6','#fb923c']

/* ── Stat Card ── */
function StatCard({ label, value, sub, accent, delay }) {
  return (
    <div className={`card fade-up-${delay}`} style={{ padding: '20px 22px', flex: '1 1 160px', minWidth: '150px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: accent || 'var(--teal)', opacity: .06 }} />
      <p style={{ fontSize: '.72rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>{label}</p>
      <p style={{ fontSize: '1.55rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: accent || 'var(--text)' }}>{value}</p>
      {sub && <p style={{ fontSize: '.72rem', color: 'var(--muted)', marginTop: 4 }}>{sub}</p>}
    </div>
  )
}

/* ── Edit Modal ── */
function EditModal({ expense, onClose, onSave }) {
  const [form, setForm] = useState({ ...expense })
  const CATS  = ['Food','Travel','Shopping','Education','Health','Entertainment','Utilities','Other']
  const MODES = ['UPI','Cash','Card','Net Banking','Wallet']
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700 }}>Edit Expense</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
          <div>
            <label style={{ fontSize: '.72rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', display: 'block', marginBottom: 5 }}>Date</label>
            <input type="date" className="inp" value={form.date} onChange={e => set('date', e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: '.72rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', display: 'block', marginBottom: 5 }}>Amount (₹)</label>
            <input type="number" className="inp" value={form.amount} onChange={e => set('amount', e.target.value)} />
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: '.72rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', display: 'block', marginBottom: 5 }}>Category</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {CATS.map(c => <button key={c} onClick={() => set('category', c)} className={`chip ${form.category === c ? 'active-teal' : ''}`}>{c}</button>)}
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: '.72rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', display: 'block', marginBottom: 5 }}>Description</label>
          <input type="text" className="inp" value={form.description} onChange={e => set('description', e.target.value)} />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: '.72rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', display: 'block', marginBottom: 5 }}>Payment Mode</label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {MODES.map(m => <button key={m} onClick={() => set('payment_mode', m)} className={`chip ${form.payment_mode === m ? 'active-amber' : ''}`}>{m}</button>)}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} className="btn-ghost" style={{ flex: 1, padding: '11px' }}>Cancel</button>
          <button onClick={() => onSave(form)} className="btn-primary" style={{ flex: 2 }}>Save Changes</button>
        </div>
      </div>
    </div>
  )
}

/* ── Main Dashboard ── */
export default function Dashboard() {
  const [expenses, setExpenses] = useState([])
  const [summary,  setSummary]  = useState([])
  const [insights, setInsights] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [tab,      setTab]      = useState('pie')
  const [month,    setMonth]    = useState('')
  const [editing,  setEditing]  = useState(null)

  const load = async (m = '') => {
    setLoading(true)
    const q = m ? `?month=${m}` : ''
    const [e, s, i] = await Promise.all([
      axios.get(`${API}/expenses${q}`),
      axios.get(`${API}/summary${q}`),
      axios.get(`${API}/insights${q}`),
    ])
    setExpenses(e.data); setSummary(s.data); setInsights(i.data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleMonthChange = (val) => { setMonth(val); load(val) }

  const handleDelete = async (id) => {
    if (!confirm('Delete this expense?')) return
    await axios.delete(`${API}/expenses/${id}`)
    load(month)
  }

  const handleSave = async (form) => {
    await axios.put(`${API}/expenses/${form.id}`, form)
    setEditing(null); load(month)
  }

  const handleExport = () => {
    const q = month ? `?month=${month}` : ''
    window.open(`${API}/export-pdf${q}`, '_blank')
  }

  const total    = expenses.reduce((s, e) => s + e.amount, 0)
  const topCat   = [...summary].sort((a, b) => b.amount - a.amount)[0]
  const avgDaily = total ? (total / 30).toFixed(0) : 0

  return (
    <div style={{ maxWidth: 1120, margin: '0 auto', padding: '2rem 1.5rem' }}>

      {/* Header Row */}
      <div className="fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, letterSpacing: '-.03em' }}>
            Spending <span style={{ color: 'var(--teal)' }}>Overview</span>
          </h1>
          <p style={{ color: 'var(--muted)', marginTop: 4, fontSize: '.875rem' }}>Track, analyze and optimize your finances</p>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <input type="month" value={month} onChange={e => handleMonthChange(e.target.value)}
            className="inp" style={{ width: 'auto', padding: '8px 14px', fontSize: '.85rem' }} />
          {month && (
            <button onClick={() => handleMonthChange('')} className="btn-ghost" style={{ padding: '8px 14px', fontSize: '.82rem' }}>
              Clear Filter
            </button>
          )}
          <button onClick={handleExport} style={{
            padding: '8px 16px', borderRadius: '10px', border: '1px solid rgba(0,212,170,0.3)',
            background: 'rgba(0,212,170,0.08)', color: 'var(--teal)',
            fontFamily: 'var(--font-body)', fontSize: '.82rem', fontWeight: 500, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6, transition: 'all .15s',
          }}>
            ↓ Export PDF
          </button>
        </div>
      </div>

      {/* Month badge */}
      {month && (
        <div style={{ marginBottom: '1.25rem' }}>
          <span style={{ background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.25)', color: 'var(--teal)', padding: '4px 12px', borderRadius: '20px', fontSize: '.78rem', fontWeight: 500 }}>
            Showing: {month}
          </span>
        </div>
      )}

      {/* Stat Cards */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <StatCard label="Total Spent"   value={`₹${total.toLocaleString()}`}                   accent="var(--teal)"  delay={1} />
        <StatCard label="Transactions"  value={expenses.length}          sub="total entries"    accent="var(--blue)"  delay={2} />
        <StatCard label="Avg / Day"     value={`₹${Number(avgDaily).toLocaleString()}`}         accent="var(--amber)" delay={3} />
        <StatCard label="Top Category"  value={topCat?.category || '—'}  sub={topCat ? `₹${topCat.amount.toLocaleString()}` : ''} accent="var(--rose)"  delay={4} />
      </div>

      {/* Charts + Insights */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>

        {/* Chart */}
        <div className="card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700 }}>Category Breakdown</h2>
            <div style={{ display: 'flex', background: 'var(--surface2)', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
              {['pie','bar'].map(t => (
                <button key={t} onClick={() => setTab(t)} style={{
                  padding: '5px 13px', fontSize: '.72rem', fontFamily: 'var(--font-body)', fontWeight: 600,
                  border: 'none', cursor: 'pointer', transition: 'all .2s', textTransform: 'uppercase', letterSpacing: '.05em',
                  background: tab === t ? 'var(--teal)' : 'transparent',
                  color: tab === t ? '#000' : 'var(--muted)',
                }}>{t}</button>
              ))}
            </div>
          </div>

          {loading ? (
            <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 36, height: 36, border: '3px solid var(--border)', borderTopColor: 'var(--teal)', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
            </div>
          ) : summary.length === 0 ? (
            <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '70px 0', fontSize: '.875rem' }}>No data. Add expenses to see charts.</p>
          ) : tab === 'pie' ? <CategoryPieChart data={summary} /> : <CategoryBarChart data={summary} />}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: 12 }}>
            {summary.map((s, i) => {
              const t = summary.reduce((a, x) => a + x.amount, 0)
              const pct = t ? ((s.amount / t) * 100).toFixed(1) : 0
              return (
                <span key={s.category} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '.7rem', color: 'var(--muted)', background: 'var(--surface2)', borderRadius: '6px', padding: '3px 8px' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: COLORS[i % COLORS.length], display: 'inline-block' }} />
                  {s.category} {pct}%
                </span>
              )
            })}
          </div>
        </div>

        {/* Insights */}
        <div className="card" style={{ padding: '22px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, marginBottom: 14 }}>
            AI Insights
            <span style={{ marginLeft: 8, fontSize: '.65rem', color: 'var(--teal)', background: 'rgba(0,212,170,0.12)', padding: '2px 8px', borderRadius: '6px', fontFamily: 'var(--font-body)', fontWeight: 600, letterSpacing: '.06em' }}>LIVE</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto', maxHeight: 300 }}>
            {loading
              ? [1,2,3].map(i => <div key={i} style={{ height: 54, background: 'var(--surface2)', borderRadius: 10, animation: 'shimmer 1.4s infinite' }} />)
              : insights.map((ins, i) => <InsightCard key={i} insight={ins} index={i} />)
            }
          </div>
        </div>
      </div>

      {/* Expense Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700 }}>Expense Entries</h2>
          <span style={{ fontSize: '.75rem', color: 'var(--muted)' }}>{expenses.length} records</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)', fontSize: '.84rem' }}>
            <thead>
              <tr style={{ background: 'var(--surface2)' }}>
                {['Date','Category','Description','Mode','Amount','Actions'].map(h => (
                  <th key={h} style={{ padding: '10px 18px', textAlign: h === 'Amount' ? 'right' : 'left', color: 'var(--muted)', fontWeight: 500, fontSize: '.7rem', textTransform: 'uppercase', letterSpacing: '.06em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1,2,3,4,5].map(i => (
                  <tr key={i}><td colSpan={6} style={{ padding: '12px 18px' }}>
                    <div style={{ height: 16, background: 'var(--surface2)', borderRadius: 6, animation: 'shimmer 1.4s infinite', width: `${60 + i * 5}%` }} />
                  </td></tr>
                ))
              ) : expenses.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '52px', textAlign: 'center', color: 'var(--muted)' }}>No expenses yet. Add your first one!</td></tr>
              ) : (
                expenses.map(e => (
                  <tr key={e.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background .15s' }}
                    onMouseEnter={ev => ev.currentTarget.style.background = 'var(--surface2)'}
                    onMouseLeave={ev => ev.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '12px 18px', color: 'var(--muted)', whiteSpace: 'nowrap', fontSize: '.78rem' }}>{e.date}</td>
                    <td style={{ padding: '12px 18px' }}>
                      <span style={{ background: 'rgba(0,212,170,0.1)', color: 'var(--teal)', padding: '3px 10px', borderRadius: '6px', fontSize: '.72rem', fontWeight: 600 }}>{e.category}</span>
                    </td>
                    <td style={{ padding: '12px 18px', color: 'var(--text)' }}>{e.description || '—'}</td>
                    <td style={{ padding: '12px 18px', color: 'var(--muted)', fontSize: '.75rem' }}>{e.payment_mode || '—'}</td>
                    <td style={{ padding: '12px 18px', textAlign: 'right', fontWeight: 700, color: 'var(--amber)', fontFamily: 'var(--font-display)', whiteSpace: 'nowrap' }}>₹{e.amount.toLocaleString()}</td>
                    <td style={{ padding: '12px 18px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn-ghost" onClick={() => setEditing(e)} style={{ padding: '4px 10px', fontSize: '.72rem' }}>✏ Edit</button>
                        <button className="btn-danger" onClick={() => handleDelete(e.id)} style={{ padding: '4px 10px', fontSize: '.72rem' }}>✕</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editing && <EditModal expense={editing} onClose={() => setEditing(null)} onSave={handleSave} />}
    </div>
  )
}
