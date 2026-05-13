import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import AddExpense from './pages/AddExpense'
import UploadCSV from './pages/UploadCSV'

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
        <Navbar />
        <main style={{ paddingTop: '72px' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add" element={<AddExpense />} />
            <Route path="/upload" element={<UploadCSV />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
