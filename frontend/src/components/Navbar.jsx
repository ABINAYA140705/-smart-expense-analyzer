import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '▦' },
  { to: '/add',       label: 'Add Expense', icon: '+' },
  { to: '/upload',    label: 'Upload CSV',  icon: '↑' },
  { to: '/budget',    label: 'Budgets',     icon: '◎' },
]

export default function Navbar() {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(6,9,16,0.88)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border)',
      height: '68px',
      display: 'flex', alignItems: 'center',
      padding: '0 2rem',
      justifyContent: 'space-between',
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: 36, height: 36, borderRadius: '10px',
          background: 'linear-gradient(135deg, var(--teal), #00a882)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '17px', fontWeight: 800, color: '#000',
          boxShadow: '0 0 14px rgba(0,212,170,0.3)',
        }}>₹</div>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700, fontSize: '1.1rem',
          color: 'var(--text)', letterSpacing: '-.02em',
        }}>
          Expense<span style={{ color: 'var(--teal)' }}>AI</span>
        </span>
      </div>

      {/* Links */}
      <div style={{ display: 'flex', gap: '4px' }}>
        {navItems.map(({ to, label, icon }) => (
          <NavLink key={to} to={to} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '7px 15px', borderRadius: '10px',
            fontFamily: 'var(--font-body)', fontSize: '.875rem', fontWeight: 500,
            textDecoration: 'none', transition: 'all .2s',
            background: isActive ? 'rgba(0,212,170,0.1)' : 'transparent',
            color: isActive ? 'var(--teal)' : 'var(--muted)',
            border: isActive ? '1px solid rgba(0,212,170,0.25)' : '1px solid transparent',
          })}>
            <span style={{ fontSize: '11px' }}>{icon}</span>
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
