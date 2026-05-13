import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'

const COLORS = ['#00d4aa','#ffb347','#ff5e7d','#4fa3ff','#a78bfa','#34d399','#f472b6','#fb923c']

const Tip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--surface2)', border: '1px solid var(--border2)',
      borderRadius: '10px', padding: '10px 14px',
      fontFamily: 'var(--font-body)', fontSize: '.8rem',
      boxShadow: '0 8px 24px rgba(0,0,0,.4)',
    }}>
      <p style={{ color: 'var(--muted)', marginBottom: 3 }}>{payload[0].name}</p>
      <p style={{ color: 'var(--teal)', fontWeight: 700, fontSize: '.95rem' }}>₹{Number(payload[0].value).toLocaleString()}</p>
    </div>
  )
}

export function CategoryPieChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100}
          dataKey="amount" nameKey="category" paddingAngle={3}>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />)}
        </Pie>
        <Tooltip content={<Tip />} />
      </PieChart>
    </ResponsiveContainer>
  )
}

export function CategoryBarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="category" tick={{ fill: 'var(--muted)', fontSize: 11, fontFamily: 'var(--font-body)' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip content={<Tip />} cursor={{ fill: 'rgba(0,212,170,0.05)' }} />
        <Bar dataKey="amount" radius={[6,6,0,0]}>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
