'use client'

import { useState, useEffect } from 'react'

const START_DATE = new Date('2026-04-02T00:00:00')
const START_WEIGHT = null
const TOTAL_DAYS = 30
const ADMIN_PASSWORD = 'carnivore30'

// ─── DATA — ADD NEW ENTRIES HERE EACH DAY ────────────────────────────────────
const ENTRIES = []

// ─── UTILS ───────────────────────────────────────────────────────────────────
function formatDate(dateStr) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })
}
function avg(arr, key) {
  const vals = arr.map(e => e[key]).filter(v => v != null)
  return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null
}

// ─── WEIGHT CHART ─────────────────────────────────────────────────────────────
function WeightChart({ entries }) {
  const pts = [...entries].filter(e => e.weight).sort((a, b) => a.date.localeCompare(b.date))
  if (!pts.length) return (
    <div style={{ textAlign: 'center', color: '#ccc', padding: '36px', fontSize: '13px', fontStyle: 'italic' }}>
      Weight chart will appear once you log your first weigh-in.
    </div>
  )
  const W = 560, H = 140, P = { t: 16, r: 16, b: 30, l: 44 }
  const cw = W - P.l - P.r, ch = H - P.t - P.b
  const ws = pts.map(e => e.weight)
  const minW = Math.floor(Math.min(...ws) - 3), maxW = Math.ceil(Math.max(...ws) + 1)
  const x = day => P.l + ((day - 1) / (TOTAL_DAYS - 1)) * cw
  const y = w => P.t + (1 - (w - minW) / (maxW - minW)) * ch
  const line = pts.map((e, i) => `${i === 0 ? 'M' : 'L'} ${x(e.day)} ${y(e.weight)}`).join(' ')
  const area = pts.length > 1
    ? `${line} L ${x(pts[pts.length-1].day)} ${H-P.b} L ${x(pts[0].day)} ${H-P.b} Z` : null
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      <defs>
        <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b85c2c" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#b85c2c" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0,.25,.5,.75,1].map(t => {
        const yw = P.t + t*ch, wv = Math.round(maxW - t*(maxW-minW))
        return <g key={t}>
          <line x1={P.l} y1={yw} x2={W-P.r} y2={yw} stroke="#f0ece6" strokeWidth="1"/>
          <text x={P.l-6} y={yw+4} textAnchor="end" fontSize="9" fill="#bbb">{wv}</text>
        </g>
      })}
      {[1,10,20,30].map(d => (
        <text key={d} x={x(d)} y={H-4} textAnchor="middle" fontSize="9" fill="#bbb">Day {d}</text>
      ))}
      {area && <path d={area} fill="url(#wg)"/>}
      <path d={line} fill="none" stroke="#b85c2c" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
      {pts.map(e => <circle key={e.day} cx={x(e.day)} cy={y(e.weight)} r="4" fill="#b85c2c"/>)}
    </svg>
  )
}

// ─── PROGRESS GRID ────────────────────────────────────────────────────────────
function ProgressGrid({ entries }) {
  const logged = new Set(entries.map(e => e.day))
  const today = Math.floor((new Date() - START_DATE) / 86400000) + 1
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '6px' }}>
      {Array.from({ length: TOTAL_DAYS }, (_, i) => {
        const d = i+1, done = logged.has(d), isToday = d === today
        return (
          <div key={d} style={{
            aspectRatio: '1', borderRadius: '6px', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: '10px', fontWeight: '600',
            background: done ? '#1a1a1a' : isToday ? '#f0e8e0' : '#f5f3f0',
            color: done ? '#fff' : isToday ? '#b85c2c' : '#ccc',
            border: isToday ? '2px solid #b85c2c' : '2px solid transparent',
          }}>
            {done ? '✓' : d}
          </div>
        )
      })}
    </div>
  )
}

function Stat({ label, value, sub, accent }) {
  return (
    <div style={{ background: '#fff', borderRadius: '10px', padding: '20px', border: '1px solid #ede9e3' }}>
      <div style={{ fontSize: '10px', letterSpacing: '2px', color: '#aaa', marginBottom: '6px' }}>{label.toUpperCase()}</div>
      <div style={{ fontSize: '26px', fontWeight: '700', color: accent ? '#b85c2c' : '#1a1a1a', fontFamily: "'Playfair Display', Georgia, serif", lineHeight: 1 }}>{value ?? '—'}</div>
      {sub && <div style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>{sub}</div>}
    </div>
  )
}

function DayCard({ entry }) {
  const [open, setOpen] = useState(entry.day === 1)
  const delta = entry.weight != null && START_WEIGHT != null ? (entry.weight - START_WEIGHT).toFixed(1) : null
  return (
    <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #ede9e3', overflow: 'hidden' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: '100%', background: 'none', border: 'none', padding: '18px 22px',
        cursor: 'pointer', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', fontFamily: 'inherit', textAlign: 'left',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ background: '#1a1a1a', color: '#fff', borderRadius: '5px', padding: '3px 9px', fontSize: '11px', letterSpacing: '1px' }}>
            DAY {entry.day}
          </div>
          <div style={{ fontSize: '14px', color: '#555', fontFamily: "'Playfair Display', Georgia, serif" }}>
            {formatDate(entry.date)}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {entry.weight != null && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a1a' }}>{entry.weight} lbs</div>
              {delta !== null && <div style={{ fontSize: '11px', color: parseFloat(delta) <= 0 ? '#22a06b' : '#e05c2c' }}>
                {parseFloat(delta) <= 0 ? delta : `+${delta}`} lbs
              </div>}
            </div>
          )}
          <span style={{ color: '#ccc', fontSize: '11px' }}>{open ? '▲' : '▼'}</span>
        </div>
      </button>
      {open && (
        <div style={{ padding: '0 22px 22px', borderTop: '1px solid #f5f2ee' }}>
          {(entry.calories || entry.protein != null) && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', margin: '16px 0' }}>
              {[
                { label: 'Calories', val: entry.calories, color: '#b85c2c' },
                { label: 'Protein', val: entry.protein != null ? `${entry.protein}g` : null, color: '#e05c7a' },
                { label: 'Fat', val: entry.fat != null ? `${entry.fat}g` : null, color: '#22a06b' },
                { label: 'Carbs', val: entry.carbs != null ? `${entry.carbs}g` : null, color: '#999' },
              ].map(({ label, val, color }) => val != null && (
                <div key={label} style={{ background: '#faf9f8', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '9px', letterSpacing: '2px', color: '#bbb', marginBottom: '4px' }}>{label.toUpperCase()}</div>
                  <div style={{ fontSize: '17px', fontWeight: '700', color }}>{val}</div>
                </div>
              ))}
            </div>
          )}
          {entry.note && (
            <p style={{
              margin: 0, fontSize: '14px', lineHeight: '1.75', color: '#555',
              fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic',
              borderLeft: '3px solid #e8ddd4', paddingLeft: '14px',
            }}>{entry.note}</p>
          )}
        </div>
      )}
    </div>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function CarnivoreTracker() {
  const sorted = [...ENTRIES].sort((a, b) => b.date.localeCompare(a.date))
  const latest = sorted[0]
  const currentWeight = latest?.weight
  const lostLbs = currentWeight != null && START_WEIGHT != null ? (START_WEIGHT - currentWeight).toFixed(1) : null
  const today = Math.floor((new Date() - START_DATE) / 86400000) + 1
  const currentDay = Math.min(Math.max(today, 1), TOTAL_DAYS)
  const avgCal = avg(sorted, 'calories')
  const avgPro = avg(sorted, 'protein')

  return (
    <div style={{ minHeight: '100vh', background: '#faf9f7', fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      {/* HERO */}
      <div style={{ background: '#1a1a1a', color: '#fff', padding: '56px 24px 44px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 110%, rgba(184,92,44,0.25) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'inline-block', background: 'rgba(184,92,44,0.2)', border: '1px solid rgba(184,92,44,0.4)', borderRadius: '20px', padding: '4px 14px', fontSize: '10px', letterSpacing: '3px', color: '#b85c2c', marginBottom: '18px' }}>
            LIVE EXPERIMENT
          </div>
          <h1 style={{ margin: '0 0 10px', fontSize: 'clamp(30px, 7vw, 52px)', fontFamily: "'Playfair Display', Georgia, serif", fontWeight: '400', lineHeight: 1.1 }}>
            30 Day Carnivore<br /><em style={{ color: '#b85c2c' }}>Experiment</em>
          </h1>
          <p style={{ margin: '0 auto 28px', maxWidth: '440px', fontSize: '14px', color: 'rgba(255,255,255,0.45)', lineHeight: '1.7', fontWeight: '300' }}>
            Water · Coffee · Meat · Nothing else.<br />
            Tracking every day — weight, macros, and how it actually feels.
          </p>
          <div style={{ display: 'flex', gap: '28px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[['Started', 'April 2, 2026'], ['Current Day', `Day ${currentDay} of 30`], ['Days Logged', ENTRIES.length]].map(([label, val]) => (
              <div key={label}>
                <div style={{ fontSize: '9px', letterSpacing: '2px', color: 'rgba(255,255,255,0.3)', marginBottom: '4px' }}>{label.toUpperCase()}</div>
                <div style={{ fontSize: '19px', fontWeight: '600' }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '36px 18px 80px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '36px' }}>
          <Stat label="Starting Weight" value={START_WEIGHT ? `${START_WEIGHT} lbs` : '—'} />
          <Stat label="Current Weight" value={currentWeight != null ? `${currentWeight} lbs` : '—'} accent />
          <Stat label="Total Lost" value={lostLbs && parseFloat(lostLbs) > 0 ? `${lostLbs} lbs` : '—'} accent={lostLbs && parseFloat(lostLbs) > 0} sub={lostLbs && parseFloat(lostLbs) > 0 ? 'Keep going' : null} />
          <Stat label="Avg Daily Calories" value={avgCal ? avgCal.toLocaleString() : '—'} sub={avgPro ? `${avgPro}g avg protein` : null} />
        </div>

        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #ede9e3', padding: '22px', marginBottom: '14px' }}>
          <div style={{ fontSize: '10px', letterSpacing: '2px', color: '#aaa', marginBottom: '14px' }}>WEIGHT OVER TIME</div>
          <WeightChart entries={ENTRIES} />
        </div>

        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #ede9e3', padding: '22px', marginBottom: '36px' }}>
          <div style={{ fontSize: '10px', letterSpacing: '2px', color: '#aaa', marginBottom: '14px' }}>30-DAY PROGRESS</div>
          <ProgressGrid entries={ENTRIES} />
          <div style={{ display: 'flex', gap: '16px', marginTop: '10px', fontSize: '11px', color: '#bbb' }}>
            <span>■ <span style={{ color: '#1a1a1a' }}>Logged</span></span>
            <span style={{ color: '#b85c2c' }}>■ Today</span>
            <span>□ Upcoming</span>
          </div>
        </div>

        <div style={{ fontSize: '10px', letterSpacing: '2px', color: '#aaa', marginBottom: '14px' }}>DAILY LOG</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {sorted.map(entry => <DayCard key={entry.date} entry={entry} />)}
        </div>

        <div style={{ textAlign: 'center', marginTop: '60px', paddingTop: '28px', borderTop: '1px solid #ede9e3', fontSize: '11px', color: '#ccc', letterSpacing: '2px' }}>
          WATER · COFFEE · MEAT · 30 DAYS
        </div>
      </div>
    </div>
  )
}
