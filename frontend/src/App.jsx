import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/navbar'
import Dashboard from './pages/dashboard'
import AddExpense from './pages/AddExpense'
import UploadCSV from './pages/uploadCSV'
import Budget from './pages/Budget'

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh' }}>
        <Navbar />
        <main style={{ paddingTop: '72px' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add"       element={<AddExpense />} />
            <Route path="/upload"    element={<UploadCSV />} />
            <Route path="/budget"    element={<Budget />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}