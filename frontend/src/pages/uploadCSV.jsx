import { useState, useRef } from 'react'
import axios from 'axios'

const API = 'http://localhost:5000'

export default function UploadCSV() {
  const [file,     setFile]     = useState(null)
  const [status,   setStatus]   = useState(null)
  const [message,  setMessage]  = useState('')
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef()

  const handleFile = (f) => {
    if (f && f.name.endsWith('.csv')) { setFile(f); setStatus(null) }
    else { setStatus('error'); setMessage('Only .csv files are supported.') }
  }

  const handleDrop = (e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }

  const handleUpload = async () => {
    if (!file) return
    setStatus('loading')
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await axios.post(`${API}/upload-csv`, formData)
      setStatus('success'); setMessage(res.data.message || 'Uploaded successfully!'); setFile(null)
    } catch (err) {
      setStatus('error'); setMessage(err.response?.data?.error || 'Upload failed. Check your CSV format.')
    }
  }

  return (
    <div style={{ maxWidth: 580, margin: '0 auto', padding: '2rem 1.5rem' }}>

      <div className="fade-up" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, letterSpacing: '-.03em' }}>
          Upload <span style={{ color: 'var(--teal)' }}>CSV</span>
        </h1>
        <p style={{ color: 'var(--muted)', marginTop: 4, fontSize: '.875rem' }}>Bulk import expenses from a spreadsheet</p>
      </div>

      {/* Drop Zone */}
      <div className="fade-up-1"
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragging ? 'var(--teal)' : file ? 'rgba(0,212,170,0.5)' : 'var(--border2)'}`,
          borderRadius: '18px', padding: '52px 24px', textAlign: 'center', cursor: 'pointer',
          background: dragging ? 'rgba(0,212,170,0.04)' : file ? 'rgba(0,212,170,0.03)' : 'var(--surface)',
          transition: 'all .2s', marginBottom: '1rem',
        }}
      >
        <input ref={inputRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
        <div style={{ fontSize: '2.8rem', marginBottom: 12 }}>{file ? '📄' : dragging ? '📂' : '☁️'}</div>
        {file ? (
          <>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--teal)' }}>{file.name}</p>
            <p style={{ color: 'var(--muted)', fontSize: '.8rem', marginTop: 4 }}>{(file.size / 1024).toFixed(1)} KB · Click to change</p>
          </>
        ) : (
          <>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem' }}>Drop your CSV here</p>
            <p style={{ color: 'var(--muted)', fontSize: '.8rem', marginTop: 5 }}>or click to browse files</p>
          </>
        )}
      </div>

      {/* Upload Button */}
      <button className="btn-primary" onClick={handleUpload} disabled={!file || status === 'loading'}
        style={{ width: '100%', marginBottom: '1rem', background: !file ? 'var(--surface2)' : undefined, color: !file ? 'var(--muted)' : undefined }}>
        {status === 'loading' ? 'Uploading...' : '↑ Upload CSV'}
      </button>

      {status === 'success' && (
        <div style={{ padding: '12px 16px', borderRadius: 12, background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.25)', color: 'var(--teal)', fontSize: '.875rem', marginBottom: '1rem' }}>
          ✓ {message}
        </div>
      )}
      {status === 'error' && (
        <div style={{ padding: '12px 16px', borderRadius: 12, background: 'var(--rose-dim)', border: '1px solid rgba(255,94,125,0.25)', color: 'var(--rose)', fontSize: '.875rem', marginBottom: '1rem' }}>
          ✗ {message}
        </div>
      )}

      {/* Format Guide */}
      <div className="card fade-up-2" style={{ padding: '20px 22px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '.9rem', fontWeight: 700, marginBottom: 12 }}>
          Expected CSV Format
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.78rem', fontFamily: 'var(--font-body)' }}>
            <thead>
              <tr>
                {['Date','Category','Description','Amount','Payment Mode'].map(h => (
                  <th key={h} style={{ padding: '7px 10px', background: 'var(--surface2)', color: 'var(--teal)', fontWeight: 600, textAlign: 'left', fontSize: '.72rem' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[['2026-05-01','Food','Lunch','120','UPI'],['2026-05-02','Travel','Bus fare','40','Cash'],['2026-05-03','Shopping','New dress','950','Card']].map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                  {row.map((cell, j) => <td key={j} style={{ padding: '7px 10px', color: 'var(--muted)' }}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: '.72rem', marginTop: 10 }}>ⓘ Column names are case-sensitive. Date format: YYYY-MM-DD</p>
      </div>
    </div>
  )
}
