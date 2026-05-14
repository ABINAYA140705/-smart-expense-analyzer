import { useState } from 'react'
import axios from 'axios'

const API = 'https://smart-expense-api-7i7d.onrender.com/'
const CATEGORIES  = ['Food','Travel','Shopping','Education','Health','Entertainment','Utilities','Other']
const PAYMENT_MODES = ['UPI','Cash','Card','Net Banking','Wallet']

export default function AddExpense() {
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm]     = useState({ date: today, category: 'Food', description: '', amount: '', payment_mode: 'UPI' })
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    const amt = parseFloat(form.amount)
    if (!form.amount || isNaN(amt) || amt <= 0) { setStatus('error'); return }
    setLoading(true)
    try {
      await axios.post(`${API}/add-expense`, { ...form, amount: amt })
      setStatus('success')
      setForm(f => ({ ...f, description: '', amount: '' }))
    } catch {
      setStatus('error')
    } finally {
      setLoading(false)
      setTimeout(() => setStatus(null), 3000)
    }
  }

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '2rem 1.5rem' }}>

      {/* Header */}
      <div className="fade-up" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, letterSpacing: '-.03em' }}>
          Add <span style={{ color: 'var(--teal)' }}>Expense</span>
        </h1>
        <p style={{ color: 'var(--muted)', marginTop: 4, fontSize: '.875rem' }}>Record a new spending entry</p>
      </div>

      <div className="card fade-up-1" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Date + Amount */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <label style={{ fontSize: '.72rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.07em', display: 'block', marginBottom: 6 }}>Date</label>
            <input type="date" className="inp" value={form.date} onChange={e => set('date', e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: '.72rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.07em', display: 'block', marginBottom: 6 }}>Amount (₹)</label>
            <input type="number" className="inp" placeholder="0" value={form.amount} onChange={e => set('amount', e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          </div>
        </div>

        {/* Category */}
        <div>
          <label style={{ fontSize: '.72rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.07em', display: 'block', marginBottom: 8 }}>Category</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => set('category', c)} className={`chip ${form.category === c ? 'active-teal' : ''}`}>{c}</button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label style={{ fontSize: '.72rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.07em', display: 'block', marginBottom: 6 }}>Description</label>
          <input type="text" className="inp" placeholder="e.g. Lunch at canteen" value={form.description} onChange={e => set('description', e.target.value)} />
        </div>

        {/* Payment Mode */}
        <div>
          <label style={{ fontSize: '.72rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.07em', display: 'block', marginBottom: 8 }}>Payment Mode</label>
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
            {PAYMENT_MODES.map(m => (
              <button key={m} onClick={() => set('payment_mode', m)} className={`chip ${form.payment_mode === m ? 'active-amber' : ''}`}>{m}</button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button className="btn-primary" onClick={handleSubmit} disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Saving...' : '+ Add Expense'}
        </button>

        {/* Status */}
        {status === 'success' && (
          <div style={{ textAlign: 'center', padding: '10px', borderRadius: '10px', background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.25)', color: 'var(--teal)', fontSize: '.875rem' }}>
            ✓ Expense added successfully! Go to Dashboard to see it.
          </div>
        )}
        {status === 'error' && (
          <div style={{ textAlign: 'center', padding: '10px', borderRadius: '10px', background: 'var(--rose-dim)', border: '1px solid rgba(255,94,125,0.25)', color: 'var(--rose)', fontSize: '.875rem' }}>
            ✗ Please enter a valid amount and make sure Flask is running.
          </div>
        )}
      </div>

      {/* Quick tips */}
      <div className="fade-up-2" style={{ marginTop: '1.25rem', padding: '14px 18px', borderRadius: 12, background: 'rgba(0,212,170,0.05)', border: '1px solid rgba(0,212,170,0.12)' }}>
        <p style={{ fontSize: '.78rem', color: 'var(--muted)', lineHeight: 1.6 }}>
          💡 <strong style={{ color: 'var(--teal)' }}>Tip:</strong> You can also bulk import expenses using the Upload CSV page. Press <kbd style={{ background: 'var(--surface2)', padding: '1px 5px', borderRadius: 4, fontSize: '.72rem' }}>Enter</kbd> to quickly submit.
        </p>
      </div>
    </div>
  )
}
