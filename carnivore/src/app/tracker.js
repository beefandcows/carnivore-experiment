'use client'

import { useState, useEffect } from 'react'

const START_DATE = new Date('2026-04-02T00:00:00')
const TOTAL_DAYS = 30
const ADMIN_PASSWORD = 'carnivore30'

function getDayNumber(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  return Math.floor((d - START_DATE) / 86400000) + 1
}
function formatDate(dateStr) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
  })
}
function todayStr() { return new Date().toISOString().slice(0, 10) }
function avg(arr, key) {
  const vals = arr.map(e => e[key]).filter(v => v != null)
  return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null
}

function WeightChart({ entries }) {
  const pts = [...entries].filter(e => e.weight).sort((a, b) => a.date.localeCompare(b.date))
  if (!pts.length) return (
    <div style={{ textAlign: 'center', color: '#999', padding: '24px', fontSize: '11px', letterSpacing: '2px' }}>NO DATA YET</div>
  )
  const W = 560, H = 120, P = { t: 12, r: 16, b: 28, l: 44 }
  const cw = W - P.l - P.r, ch = H - P.t - P.b
  const ws = pts.map(e => e.weight)
  const minW = Math.floor(Math.min(...ws) - 2), maxW = Math.ceil(Math.max(...ws) + 1)
  const x = day => P.l + ((day - 1) / (TOTAL_DAYS - 1)) * cw
  const y = w => P.t + (1 - (w - minW) / (maxW - minW)) * ch
  const line = pts.map((e, i) => `${i === 0 ? 'M' : 'L'} ${x(e.day)} ${y(e.weight)}`).join(' ')
  const area = pts.length > 1 ? `${line} L ${x(pts[pts.length - 1].day)} ${H - P.b} L ${x(pts[0].day)} ${H - P.b} Z` : null
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      <defs>
        <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1a1a" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#1a1a1a" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.5, 1].map(t => {
        const yw = P.t + t * ch, wv = Math.round(maxW - t * (maxW - minW))
        return <g key={t}>
          <line x1={P.l} y1={yw} x2={W - P.r} y2={yw} stroke="#e8e8e8" strokeWidth="1" />
          <text x={P.l - 6} y={yw + 4} textAnchor="end" fontSize="9" fill="#aaa" fontFamily="monospace">{wv}</text>
        </g>
      })}
      {[1, 10, 20, 30].map(d => (
        <text key={d} x={x(d)} y={H - 4} textAnchor="middle" fontSize="9" fill="#bbb" fontFamily="monospace">D{d}</text>
      ))}
      {area && <path d={area} fill="url(#wg)" />}
      <path d={line} fill="none" stroke="#1a1a1a" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      {pts.map(e => <circle key={e.day} cx={x(e.day)} cy={y(e.weight)} r="3" fill="#1a1a1a" />)}
    </svg>
  )
}

function ProteinChart({ entries }) {
  const pts = [...entries].filter(e => e.protein).sort((a, b) => a.date.localeCompare(b.date))
  if (!pts.length) return (
    <div style={{ textAlign: 'center', color: '#999', padding: '24px', fontSize: '11px', letterSpacing: '2px' }}>NO DATA YET</div>
  )
  const W = 560, H = 120, P = { t: 12, r: 16, b: 28, l: 44 }
  const cw = W - P.l - P.r, ch = H - P.t - P.b
  const ps = pts.map(e => e.protein)
  const minP = Math.floor(Math.min(...ps) - 10), maxP = Math.ceil(Math.max(...ps) + 10)
  const x = day => P.l + ((day - 1) / (TOTAL_DAYS - 1)) * cw
  const y = p => P.t + (1 - (p - minP) / (maxP - minP)) * ch
  const line = pts.map((e, i) => `${i === 0 ? 'M' : 'L'} ${x(e.day)} ${y(e.protein)}`).join(' ')
  const area = pts.length > 1 ? `${line} L ${x(pts[pts.length - 1].day)} ${H - P.b} L ${x(pts[0].day)} ${H - P.b} Z` : null
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      <defs>
        <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c0392b" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#c0392b" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.5, 1].map(t => {
        const yw = P.t + t * ch, pv = Math.round(maxP - t * (maxP - minP))
        return <g key={t}>
          <line x1={P.l} y1={yw} x2={W - P.r} y2={yw} stroke="#e8e8e8" strokeWidth="1" />
          <text x={P.l - 6} y={yw + 4} textAnchor="end" fontSize="9" fill="#aaa" fontFamily="monospace">{pv}</text>
        </g>
      })}
      {[1, 10, 20, 30].map(d => (
        <text key={d} x={x(d)} y={H - 4} textAnchor="middle" fontSize="9" fill="#bbb" fontFamily="monospace">D{d}</text>
      ))}
      {area && <path d={area} fill="url(#pg)" />}
      <path d={line} fill="none" stroke="#c0392b" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      {pts.map(e => <circle key={e.day} cx={x(e.day)} cy={y(e.protein)} r="3" fill="#c0392b" />)}
    </svg>
  )
}

function RatioChart({ entries }) {
  const pts = [...entries].filter(e => e.protein && e.calories).sort((a, b) => a.date.localeCompare(b.date))
  pts.forEach(e => e.ratio = parseFloat((e.calories / e.protein).toFixed(1)))
  if (!pts.length) return (
    <div style={{ textAlign: 'center', color: '#999', padding: '24px', fontSize: '11px', letterSpacing: '2px' }}>NO DATA YET</div>
  )
  const W = 560, H = 120, P = { t: 12, r: 16, b: 28, l: 44 }
  const cw = W - P.l - P.r, ch = H - P.t - P.b
  const rs = pts.map(e => e.ratio)
  const minR = Math.floor(Math.min(...rs) - 1), maxR = Math.ceil(Math.max(...rs) + 1)
  const x = day => P.l + ((day - 1) / (TOTAL_DAYS - 1)) * cw
  const y = r => P.t + (1 - (r - minR) / (maxR - minR)) * ch
  const line = pts.map((e, i) => `${i === 0 ? 'M' : 'L'} ${x(e.day)} ${y(e.ratio)}`).join(' ')
  const area = pts.length > 1 ? `${line} L ${x(pts[pts.length - 1].day)} ${H - P.b} L ${x(pts[0].day)} ${H - P.b} Z` : null
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      <defs>
        <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2980b9" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#2980b9" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.5, 1].map(t => {
        const yw = P.t + t * ch, rv = (maxR - t * (maxR - minR)).toFixed(1)
        return <g key={t}>
          <line x1={P.l} y1={yw} x2={W - P.r} y2={yw} stroke="#e8e8e8" strokeWidth="1" />
          <text x={P.l - 6} y={yw + 4} textAnchor="end" fontSize="9" fill="#aaa" fontFamily="monospace">{rv}</text>
        </g>
      })}
      {[1, 10, 20, 30].map(d => (
        <text key={d} x={x(d)} y={H - 4} textAnchor="middle" fontSize="9" fill="#bbb" fontFamily="monospace">D{d}</text>
      ))}
      {area && <path d={area} fill="url(#rg)" />}
      <path d={line} fill="none" stroke="#2980b9" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      {pts.map(e => <circle key={e.day} cx={x(e.day)} cy={y(e.ratio)} r="3" fill="#2980b9" />)}
    </svg>
  )
}

function ProgressGrid({ entries }) {
  const logged = new Set(entries.map(e => e.day))
  const today = Math.floor((new Date() - START_DATE) / 86400000) + 1
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '4px' }}>
      {Array.from({ length: TOTAL_DAYS }, (_, i) => {
        const d = i + 1, done = logged.has(d), isToday = d === today
        return (
          <div key={d} style={{
            aspectRatio: '1', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '9px', fontWeight: '600', fontFamily: 'monospace',
            background: done ? '#1a1a1a' : isToday ? '#f0f0f0' : '#f8f8f8',
            color: done ? '#fff' : isToday ? '#1a1a1a' : '#ccc',
            border: isToday ? '1.5px solid #1a1a1a' : '1.5px solid transparent',
          }}>
            {done ? '✓' : d}
          </div>
        )
      })}
    </div>
  )
}

function AdminForm({ onSave, onClose, initial }) {
  const [form, setForm] = useState(initial ? {
    date: initial.date, weight: initial.weight ?? '', protein: initial.protein ?? '',
    fat: initial.fat ?? '', carbs: initial.carbs ?? '0', calories: initial.calories ?? '', note: initial.note ?? ''
  } : { date: todayStr(), weight: '', protein: '', fat: '', carbs: '0', calories: '', note: '' })
  const [status, setStatus] = useState('idle')
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function submit() {
    setStatus('saving')
    const entry = {
      date: form.date, day: getDayNumber(form.date),
      weight: form.weight !== '' ? parseFloat(form.weight) : null,
      protein: form.protein !== '' ? parseInt(form.protein) : null,
      fat: form.fat !== '' ? parseInt(form.fat) : null,
      carbs: form.carbs !== '' ? parseInt(form.carbs) : 0,
      calories: form.calories !== '' ? parseInt(form.calories) : null,
      note: form.note.trim() || null,
    }
    const res = await fetch('/api/entries', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: ADMIN_PASSWORD, action: 'saveEntry', entry })
    })
    if (res.ok) { setStatus('saved'); setTimeout(onSave, 800) }
    else setStatus('error')
  }

  const inp = {
    width: '100%', padding: '8px 10px', border: '1px solid #e0e0e0', borderRadius: '3px',
    fontSize: '13px', fontFamily: 'monospace', background: '#fafafa', color: '#1a1a1a',
    boxSizing: 'border-box', outline: 'none',
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: '#fff', borderRadius: '6px', padding: '28px', width: '100%', maxWidth: '440px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ fontSize: '11px', letterSpacing: '2px', color: '#1a1a1a', fontWeight: '600' }}>{initial ? 'EDIT ENTRY' : 'LOG ENTRY'}</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', color: '#999' }}>✕</button>
        </div>
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '10px', letterSpacing: '2px', color: '#999', marginBottom: '4px' }}>DATE</div>
          <input type="date" value={form.date} onChange={e => set('date', e.target.value)} style={inp} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
          {[['WEIGHT (LBS)', 'weight', '251.4'], ['CALORIES', 'calories', '1950'], ['PROTEIN (G)', 'protein', '169'], ['FAT (G)', 'fat', '136'], ['CARBS (G)', 'carbs', '0']].map(([l, k, ph]) => (
            <div key={k}>
              <div style={{ fontSize: '10px', letterSpacing: '2px', color: '#999', marginBottom: '4px' }}>{l}</div>
              <input type="number" placeholder={ph} value={form[k]} onChange={e => set(k, e.target.value)} style={inp} />
            </div>
          ))}
        </div>
        <div style={{ marginBottom: '18px' }}>
          <div style={{ fontSize: '10px', letterSpacing: '2px', color: '#999', marginBottom: '4px' }}>JOURNAL NOTE</div>
          <textarea value={form.note} onChange={e => set('note', e.target.value)} rows={4}
            placeholder="How did you feel? What did you eat?" style={{ ...inp, resize: 'vertical', lineHeight: '1.6' }} />
        </div>
        <button onClick={submit} style={{
          width: '100%', padding: '12px', color: '#fff', border: 'none', borderRadius: '3px',
          fontSize: '11px', letterSpacing: '2px', cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.3s',
          background: status === 'saved' ? '#2a7a4a' : status === 'error' ? '#cc3333' : '#1a1a1a',
        }}>
          {status === 'saved' ? '✓ SAVED' : status === 'saving' ? 'SAVING...' : status === 'error' ? 'ERROR — TRY AGAIN' : 'SAVE ENTRY'}
        </button>
      </div>
    </div>
  )
}

function DayCard({ entry, startWeight, isAdmin, onEdit, onDelete }) {
  const [open, setOpen] = useState(false)
  const delta = entry.weight != null && startWeight != null ? (entry.weight - startWeight).toFixed(1) : null
  return (
    <div style={{ border: '1px solid #ebebeb', borderRadius: '4px', overflow: 'hidden', background: '#fff' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: '100%', background: 'none', border: 'none', padding: '14px 18px',
        cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'inherit', textAlign: 'left',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#1a1a1a', color: '#fff', borderRadius: '3px', padding: '2px 8px', fontSize: '10px', letterSpacing: '1px', fontFamily: 'monospace' }}>D{entry.day}</div>
          <div style={{ fontSize: '13px', color: '#555' }}>{formatDate(entry.date)}</div>
          {entry.calories && <div style={{ fontSize: '11px', color: '#aaa', fontFamily: 'monospace' }}>{entry.calories} kcal</div>}
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {entry.weight != null && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', fontFamily: 'monospace' }}>{entry.weight}</div>
              {delta !== null && <div style={{ fontSize: '10px', color: parseFloat(delta) <= 0 ? '#2a7a4a' : '#cc3333', fontFamily: 'monospace' }}>{parseFloat(delta) <= 0 ? delta : `+${delta}`}</div>}
            </div>
          )}
          <span style={{ color: '#ccc', fontSize: '10px' }}>{open ? '▲' : '▼'}</span>
        </div>
      </button>
      {open && (
        <div style={{ borderTop: '1px solid #f0f0f0', padding: '16px 18px' }}>
          {(entry.calories || entry.protein != null) && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: '#ebebeb', border: '1px solid #ebebeb', borderRadius: '3px', overflow: 'hidden', marginBottom: '14px' }}>
              {[{ label: 'KCAL', val: entry.calories }, { label: 'PRO', val: entry.protein != null ? `${entry.protein}g` : null }, { label: 'FAT', val: entry.fat != null ? `${entry.fat}g` : null }, { label: 'CHO', val: entry.carbs != null ? `${entry.carbs}g` : null }]
                .map(({ label, val }) => val != null && (
                  <div key={label} style={{ background: '#fff', padding: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '9px', letterSpacing: '2px', color: '#aaa', marginBottom: '3px' }}>{label}</div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a', fontFamily: 'monospace' }}>{val}</div>
                  </div>
                ))}
            </div>
          )}
          {entry.note && <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.7', color: '#555', borderLeft: '2px solid #e0e0e0', paddingLeft: '12px' }}>{entry.note}</p>}
          {isAdmin && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button onClick={() => onEdit(entry)} style={{ padding: '5px 12px', border: '1px solid #ddd', borderRadius: '3px', background: 'none', color: '#555', fontSize: '11px', cursor: 'pointer', letterSpacing: '1px' }}>EDIT</button>
              <button onClick={() => onDelete(entry.date)} style={{ padding: '5px 12px', border: '1px solid #ffcccc', borderRadius: '3px', background: 'none', color: '#cc3333', fontSize: '11px', cursor: 'pointer', letterSpacing: '1px' }}>DELETE</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function CarnivoreTracker() {
  const [data, setData] = useState({ startWeight: null, entries: [] })
  const [loading, setLoading] = useState(true)
  const [admin, setAdmin] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [pw, setPw] = useState('')
  const [pwErr, setPwErr] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editEntry, setEditEntry] = useState(null)
  const [taps, setTaps] = useState(0)

  async function load() {
    try {
      const res = await fetch('/api/entries')
      const d = await res.json()
      setData(d)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleDelete(date) {
    if (!confirm('Delete this entry?')) return
    await fetch('/api/entries', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: ADMIN_PASSWORD, action: 'deleteEntry', date })
    })
    load()
  }

  function tapTitle() {
    const n = taps + 1; setTaps(n)
    if (n >= 5) { setShowLogin(true); setTaps(0) }
  }

  const sorted = [...data.entries].sort((a, b) => b.date.localeCompare(a.date))
  const latest = sorted[0]
  const currentWeight = latest?.weight
  const lostLbs = currentWeight != null && data.startWeight != null ? (data.startWeight - currentWeight).toFixed(1) : null
  const today = Math.floor((new Date() - START_DATE) / 86400000) + 1
  const currentDay = Math.min(Math.max(today, 1), TOTAL_DAYS)
  const avgCal = avg(sorted, 'calories')
  const avgPro = avg(sorted, 'protein')

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
      <div style={{ fontSize: '11px', letterSpacing: '3px', color: '#aaa' }}>LOADING...</div>
    </div>
  )

  const card = { background: '#fff', border: '1px solid #ebebeb', borderRadius: '4px', padding: '16px' }
  const sh = { fontSize: '10px', letterSpacing: '3px', color: '#aaa', marginBottom: '12px', textTransform: 'uppercase' }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      <style>{`* { box-sizing: border-box; }`}</style>

      {showLogin && !admin && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: '6px', padding: '28px', width: '280px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <div style={{ fontSize: '11px', letterSpacing: '2px', marginBottom: '16px' }}>ADMIN ACCESS</div>
            <input type="password" placeholder="Password" value={pw} autoFocus
              onChange={e => setPw(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { if (pw === ADMIN_PASSWORD) { setAdmin(true); setShowLogin(false) } else { setPwErr(true); setTimeout(() => setPwErr(false), 1500) } } }}
              style={{ width: '100%', padding: '9px 11px', border: `1px solid ${pwErr ? '#cc3333' : '#e0e0e0'}`, borderRadius: '3px', fontSize: '14px', fontFamily: 'monospace', outline: 'none', boxSizing: 'border-box' }}
            />
            {pwErr && <div style={{ fontSize: '11px', color: '#cc3333', marginTop: '6px' }}>INCORRECT</div>}
            <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
              <button onClick={() => setShowLogin(false)} style={{ flex: 1, padding: '9px', border: '1px solid #e0e0e0', borderRadius: '3px', background: 'none', cursor: 'pointer', fontSize: '11px', letterSpacing: '1px' }}>CANCEL</button>
              <button onClick={() => { if (pw === ADMIN_PASSWORD) { setAdmin(true); setShowLogin(false) } else { setPwErr(true); setTimeout(() => setPwErr(false), 1500) } }} style={{ flex: 1, padding: '9px', border: 'none', borderRadius: '3px', background: '#1a1a1a', color: '#fff', cursor: 'pointer', fontSize: '11px', letterSpacing: '1px' }}>ENTER</button>
            </div>
          </div>
        </div>
      )}

      {(showForm || editEntry) && (
        <AdminForm initial={editEntry} onSave={() => { setShowForm(false); setEditEntry(null); load() }} onClose={() => { setShowForm(false); setEditEntry(null) }} />
      )}

      {/* HEADER */}
      <div style={{ background: '#1a1a1a', color: '#fff' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #2a2a2a' }}>
          <div style={{ fontSize: '10px', letterSpacing: '3px', color: '#555' }}>CARNIVORE30.VERCEL.APP</div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span style={{ fontSize: '10px', letterSpacing: '2px', color: '#555' }}>STARTED 02 APR 2026</span>
            {admin && <button onClick={() => setShowForm(true)} style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '3px', color: '#fff', fontSize: '10px', letterSpacing: '2px', cursor: 'pointer' }}>+ LOG ENTRY</button>}
          </div>
        </div>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 24px 36px' }}>
          <div style={{ fontSize: '10px', letterSpacing: '3px', color: '#555', marginBottom: '10px' }}>EXPERIMENT RECORD</div>
          <h1 onClick={tapTitle} style={{ margin: '0 0 6px', fontSize: 'clamp(26px, 5vw, 42px)', fontWeight: '300', letterSpacing: '-0.5px', lineHeight: 1.1, cursor: 'default', userSelect: 'none' }}>
            30 Day Carnivore Experiment
          </h1>
          <div style={{ fontSize: '12px', color: '#555', letterSpacing: '2px', marginBottom: '28px' }}>PROTOCOL: WATER · COFFEE · MEAT · NOTHING ELSE</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '24px' }}>
            {[
              ['STATUS', <span style={{ color: '#4aaa6a' }}>● ACTIVE</span>],
              ['DAY', `${currentDay} / ${TOTAL_DAYS}`],
              ['LOGGED', `${data.entries.length} days`],
              ['START WT', data.startWeight ? `${data.startWeight} lbs` : '—'],
              ['CURRENT WT', currentWeight ? `${currentWeight} lbs` : '—'],
              ['TOTAL LOST', lostLbs && parseFloat(lostLbs) > 0 ? `${lostLbs} lbs` : '—'],
            ].map(([label, val]) => (
              <div key={label}>
                <div style={{ fontSize: '9px', letterSpacing: '2px', color: '#555', marginBottom: '4px' }}>{label}</div>
                <div style={{ fontSize: '15px', fontWeight: '600', color: '#fff', fontFamily: 'monospace' }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '20px 24px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '8px' }}>
          {[
            ['AVG CALORIES', avgCal ? `${avgCal.toLocaleString()} kcal` : '—'],
            ['AVG PROTEIN', avgPro ? `${avgPro}g` : '—'],
            ['AVG CAL:PRO', avgCal && avgPro ? `${(avgCal / avgPro).toFixed(1)}` : '—'],
            ['PROGRESS', `${data.entries.length}/${TOTAL_DAYS}`],
          ].map(([label, val]) => (
            <div key={label} style={card}>
              <div style={{ fontSize: '10px', letterSpacing: '2px', color: '#aaa', marginBottom: '4px' }}>{label}</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a1a', fontFamily: 'monospace' }}>{val}</div>
            </div>
          ))}
        </div>

        <div style={{ ...card, marginBottom: '8px' }}>
          <div style={sh}>WEIGHT TREND (LBS)</div>
          <WeightChart entries={data.entries} />
        </div>

        <div style={{ ...card, marginBottom: '8px' }}>
          <div style={sh}>PROTEIN TREND (G)</div>
          <ProteinChart entries={data.entries} />
        </div>

        <div style={{ ...card, marginBottom: '8px' }}>
          <div style={sh}>CAL:PROTEIN RATIO (KCAL/G) — LOWER IS BETTER</div>
          <RatioChart entries={data.entries} />
        </div>

        <div style={{ ...card, marginBottom: '20px' }}>
          <div style={sh}>30-DAY PROGRESS</div>
          <ProgressGrid entries={data.entries} />
          <div style={{ display: 'flex', gap: '16px', marginTop: '10px', fontSize: '10px', color: '#bbb', letterSpacing: '1px' }}>
            <span>■ LOGGED</span><span style={{ color: '#1a1a1a' }}>■ TODAY</span><span>□ UPCOMING</span>
          </div>
        </div>

        <div style={sh}>DAILY ENTRIES</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {sorted.map(entry => (
            <DayCard key={entry.date} entry={entry} startWeight={data.startWeight} isAdmin={admin} onEdit={e => setEditEntry(e)} onDelete={handleDelete} />
          ))}
        </div>

        {data.entries.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px', color: '#bbb', fontSize: '11px', letterSpacing: '2px', border: '1px solid #ebebeb', borderRadius: '4px', background: '#fff' }}>NO ENTRIES YET</div>
        )}

        <div style={{ textAlign: 'center', marginTop: '48px', paddingTop: '20px', borderTop: '1px solid #e8e8e8', fontSize: '10px', color: '#ccc', letterSpacing: '3px' }}>
          WATER · COFFEE · MEAT · 30 DAYS
          {!admin && <div style={{ marginTop: '8px' }}><button onClick={() => setShowLogin(true)} style={{ background: 'none', border: 'none', color: '#ddd', fontSize: '10px', cursor: 'pointer', letterSpacing: '1px' }}>admin</button></div>}
        </div>
      </div>
    </div>
  )
}
