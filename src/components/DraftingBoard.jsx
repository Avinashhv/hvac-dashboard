import { useState, useRef, useEffect } from 'react'
import { Plus, X, ChevronDown, Copy, Trash2, ArrowRight } from 'lucide-react'
import CategoryBadge from './CategoryBadge'
import TaskPanel from './TaskPanel'

const STATUSES = [
  { label: 'Not Started',    bg: '#c4c4c4', text: '#444' },
  { label: 'Working on it',  bg: '#FDAB3D', text: '#7a4800' },
  { label: 'Stuck',          bg: '#E2445C', text: '#fff' },
  { label: 'Done',           bg: '#00C875', text: '#fff' },
  { label: 'Issued to Engg', bg: '#0096c7', text: '#fff' },
  { label: 'Issued to PM',   bg: '#7F77DD', text: '#fff' },
  { label: 'Waiting for Info', bg: '#ffcb00', text: '#7a5c00' },
]

const PRIORITIES = ['', 'Critical', 'High', 'Medium', 'Low']
const PRIORITY_COLORS = { Critical: '#E2445C', High: '#FDAB3D', Medium: '#0096c7', Low: '#c4c4c4' }

const GROUPS = ['To-Do', 'Waiting for Information', 'Completed no further action required']
const GROUP_COLORS = { 'To-Do': '#7F77DD', 'Waiting for Information': '#FDAB3D', 'Completed no further action required': '#00C875' }

const actionBtn = {
  background: 'rgba(255,255,255,0.08)', border: '0.5px solid rgba(255,255,255,0.15)',
  borderRadius: 7, color: 'white', cursor: 'pointer', fontSize: 12, fontWeight: 500,
  padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 5,
}

function StatusPill({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef()
  const current = STATUSES.find(s => s.label === value) || STATUSES[0]

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: current.bg, color: current.text,
          border: 'none', borderRadius: 4, padding: '4px 10px',
          fontSize: 11, fontWeight: 600, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap',
          minWidth: 110, justifyContent: 'space-between',
        }}
      >
        {current.label}
        <ChevronDown size={11} />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, zIndex: 100,
          background: 'white', border: '0.5px solid #e0dfd8', borderRadius: 8,
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)', padding: 6, minWidth: 160, marginTop: 4,
        }}>
          {STATUSES.map(s => (
            <button
              key={s.label}
              onClick={() => { onChange(s.label); setOpen(false) }}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                background: s.bg, color: s.text, border: 'none',
                borderRadius: 4, padding: '5px 10px', fontSize: 11, fontWeight: 600,
                cursor: 'pointer', marginBottom: 4,
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function PriorityCell({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef()
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        background: 'none', border: 'none', cursor: 'pointer', fontSize: 11,
        color: value ? PRIORITY_COLORS[value] : '#bbb', fontWeight: value ? 600 : 400, padding: '2px 0',
      }}>
        {value || '—'}
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, zIndex: 100,
          background: 'white', border: '0.5px solid #e0dfd8', borderRadius: 8,
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)', padding: 6, minWidth: 120, marginTop: 4,
        }}>
          {PRIORITIES.map(p => (
            <button key={p} onClick={() => { onChange(p); setOpen(false) }} style={{
              display: 'block', width: '100%', textAlign: 'left', background: 'none',
              border: 'none', padding: '5px 10px', fontSize: 11, cursor: 'pointer',
              color: p ? PRIORITY_COLORS[p] : '#888', fontWeight: p ? 600 : 400,
              borderRadius: 4,
            }}>
              {p || 'None'}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function InlineEdit({ value, onChange, placeholder = '' }) {
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(value)
  const ref = useRef()
  useEffect(() => { setVal(value) }, [value])
  if (editing) return (
    <input
      ref={ref}
      autoFocus
      value={val}
      onChange={e => setVal(e.target.value)}
      onBlur={() => { onChange(val); setEditing(false) }}
      onKeyDown={e => { if (e.key === 'Enter') { onChange(val); setEditing(false) } }}
      style={{ border: 'none', outline: '1px solid #7F77DD', borderRadius: 3, padding: '2px 6px', fontSize: 12, width: '100%', background: '#f8f7ff' }}
    />
  )
  return (
    <span
      onClick={() => setEditing(true)}
      style={{ fontSize: 12, color: value ? '#1a1a1a' : '#bbb', cursor: 'text', display: 'block', minHeight: 20, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
    >
      {value || placeholder}
    </span>
  )
}

export default function DraftingBoard({ cards, setCards }) {
  const [activeCard, setActiveCard] = useState(null)
  const [selected, setSelected] = useState(new Set())
  const [moveOpen, setMoveOpen] = useState(false)
  const moveRef = useRef()

  useEffect(() => {
    const handler = (e) => { if (moveRef.current && !moveRef.current.contains(e.target)) setMoveOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const openPanel = (card) => setActiveCard(card)
  const closePanel = () => setActiveCard(null)

  const updateCardFull = (updated) => {
    setCards(prev => prev.map(c => c.id === updated.id ? updated : c))
    setActiveCard(updated)
  }

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const clearSelected = () => setSelected(new Set())

  const duplicateSelected = () => {
    const toDup = cards.filter(c => selected.has(c.id))
    const duped = toDup.map(c => ({ ...c, id: Date.now() + Math.random(), title: c.title + ' (copy)', checked: false }))
    setCards(prev => [...prev, ...duped])
    clearSelected()
  }

  const deleteSelected = () => {
    setCards(prev => prev.filter(c => !selected.has(c.id)))
    clearSelected()
  }

  const moveSelected = (group) => {
    setCards(prev => prev.map(c => selected.has(c.id) ? { ...c, group } : c))
    setMoveOpen(false)
    clearSelected()
  }

  const addRow = (group) => {
    const newCard = {
      id: Date.now(),
      title: '',
      group,
      category: 'Drawing',
      owner: '',
      due: '',
      timelineStart: '',
      timelineEnd: '',
      priority: '',
      notes: '',
      draftStatus: 'Not Started',
    }
    setCards(prev => [...prev, newCard])
  }

  const update = (id, field, value) => {
    setCards(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c))
  }

  const remove = (id) => {
    setCards(prev => prev.filter(c => c.id !== id))
  }

  const migrate = (cards) => cards.map(c => ({
    ...c,
    group: c.group || 'To-Do',
    draftStatus: c.draftStatus || 'Not Started',
    notes: c.notes || '',
    priority: c.priority || '',
    timelineStart: c.timelineStart || '',
    timelineEnd: c.timelineEnd || '',
    checked: c.checked || false,
  }))

  const migrated = migrate(cards)

  return (
    <div style={{ overflowX: 'auto' }}>
      {/* Header row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '28px 28px 2fr 80px 140px 100px 100px 2fr 110px 170px 28px',
        gap: 0, borderBottom: '1.5px solid #e0dfd8',
        padding: '0 0 6px 0', marginBottom: 0,
      }}>
        {['', '', 'Task', 'Owner', 'Status', 'Due date', 'Priority', 'Notes', 'Category', 'Timeline', ''].map((h, i) => (
          <div key={i} style={{ fontSize: 11, fontWeight: 500, color: '#aaa', padding: '0 8px' }}>{h}</div>
        ))}
      </div>

      {/* Bottom action bar */}
      {selected.size > 0 && (
        <div style={{
          position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
          background: '#1a1a2e', color: 'white', borderRadius: 12,
          padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 6,
          boxShadow: '0 8px 32px rgba(0,0,0,0.28)', zIndex: 300, whiteSpace: 'nowrap',
        }}>
          <div style={{
            background: '#7F77DD', borderRadius: '50%',
            width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, marginRight: 6,
          }}>
            {selected.size}
          </div>
          <span style={{ fontSize: 13, fontWeight: 500, marginRight: 16 }}>
            {selected.size === 1 ? 'Task selected' : `${selected.size} tasks selected`}
          </span>

          <button onClick={duplicateSelected} style={actionBtn}>
            <Copy size={14} /> Duplicate
          </button>

          <div ref={moveRef} style={{ position: 'relative' }}>
            <button onClick={() => setMoveOpen(o => !o)} style={actionBtn}>
              <ArrowRight size={14} /> Move to
            </button>
            {moveOpen && (
              <div style={{
                position: 'absolute', bottom: '110%', left: 0,
                background: 'white', border: '0.5px solid #e0dfd8', borderRadius: 8,
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)', padding: 6, minWidth: 240,
              }}>
                {GROUPS.map(g => (
                  <button key={g} onClick={() => moveSelected(g)} style={{
                    display: 'block', width: '100%', textAlign: 'left', background: 'none',
                    border: 'none', padding: '7px 12px', fontSize: 12, cursor: 'pointer',
                    color: '#1a1a1a', borderRadius: 4,
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f5f4f0'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <span style={{ width: 10, height: 10, borderRadius: 2, background: GROUP_COLORS[g], display: 'inline-block', marginRight: 8, verticalAlign: 'middle' }} />
                    {g}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button onClick={deleteSelected} style={{ ...actionBtn, color: '#ff7575' }}>
            <Trash2 size={14} /> Delete
          </button>

          <button onClick={clearSelected} style={{
            background: 'none', border: 'none', cursor: 'pointer', color: '#888',
            marginLeft: 8, padding: 4, display: 'flex', alignItems: 'center',
          }}>
            <X size={14} />
          </button>
        </div>
      )}

      {GROUPS.map(group => {
        const groupCards = migrated.filter(c => c.group === group)
        return (
          <div key={group} style={{ marginBottom: 24 }}>
            {/* Group header */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 0 6px 0', borderBottom: `2px solid ${GROUP_COLORS[group]}`,
              marginBottom: 0,
            }}>
              <span style={{
                width: 10, height: 10, borderRadius: 2,
                background: GROUP_COLORS[group], display: 'inline-block', flexShrink: 0,
              }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{group}</span>
              <span style={{ fontSize: 11, color: '#aaa', marginLeft: 4 }}>{groupCards.length}</span>
            </div>

            {/* Rows */}
            {groupCards.map((card, idx) => (
              <div
                key={card.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '28px 28px 2fr 80px 140px 100px 100px 2fr 110px 170px 28px',
                  alignItems: 'center', gap: 0,
                  borderBottom: '0.5px solid #f0efe9',
                  background: selected.has(card.id) ? '#eeeeff' : idx % 2 === 0 ? 'white' : '#fafaf8',
                  minHeight: 38,
                }}
                onMouseEnter={e => { if (!selected.has(card.id)) e.currentTarget.style.background = '#f5f4f0' }}
                onMouseLeave={e => { if (!selected.has(card.id)) e.currentTarget.style.background = idx % 2 === 0 ? 'white' : '#fafaf8' }}
              >
                {/* colour bar */}
                <div style={{ width: 4, height: '100%', background: GROUP_COLORS[group], borderRadius: '2px 0 0 2px', alignSelf: 'stretch' }} />

                {/* Checkbox */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>
                  <input
                    type="checkbox"
                    checked={selected.has(card.id)}
                    onChange={() => toggleSelect(card.id)}
                    style={{
                      width: 15, height: 15, cursor: 'pointer', accentColor: '#7F77DD',
                      borderRadius: 3, flexShrink: 0,
                    }}
                  />
                </div>

                {/* Task title */}
                <div style={{ padding: '6px 8px', overflow: 'hidden' }}>
                  <InlineEdit value={card.title} onChange={v => update(card.id, 'title', v)} placeholder="Task name..." />
                </div>

                {/* Owner */}
                <div style={{ padding: '6px 8px' }}>
                  <InlineEdit value={card.owner} onChange={v => update(card.id, 'owner', v)} placeholder="—" />
                </div>

                {/* Status */}
                <div style={{ padding: '6px 8px' }}>
                  <StatusPill value={card.draftStatus} onChange={v => update(card.id, 'draftStatus', v)} />
                </div>

                {/* Due date */}
                <div style={{ padding: '6px 8px' }}>
                  <InlineEdit value={card.due} onChange={v => update(card.id, 'due', v)} placeholder="—" />
                </div>

                {/* Priority */}
                <div style={{ padding: '6px 8px' }}>
                  <PriorityCell value={card.priority} onChange={v => update(card.id, 'priority', v)} />
                </div>

                {/* Notes */}
                <div style={{ padding: '6px 8px' }}>
                  <InlineEdit value={card.notes} onChange={v => update(card.id, 'notes', v)} placeholder="Add note..." />
                </div>

                {/* Category */}
                <div style={{ padding: '6px 8px' }}>
                  <CategoryBadge category={card.category} />
                </div>

                {/* Timeline */}
                <div style={{ padding: '6px 8px', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <InlineEdit value={card.timelineStart} onChange={v => update(card.id, 'timelineStart', v)} placeholder="Start" />
                  <span style={{ color: '#ccc', fontSize: 10 }}>→</span>
                  <InlineEdit value={card.timelineEnd} onChange={v => update(card.id, 'timelineEnd', v)} placeholder="End" />
                </div>

                {/* Delete */}
                <div style={{ padding: '6px 4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <button onClick={() => remove(card.id)} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#ccc', padding: 2, display: 'flex', alignItems: 'center',
                  }}
                    onMouseEnter={e => e.currentTarget.style.color = '#E2445C'}
                    onMouseLeave={e => e.currentTarget.style.color = '#ccc'}
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>
            ))}

            {/* Add row */}
            <button
              onClick={() => addRow(group)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#aaa', fontSize: 12, padding: '7px 36px',
                width: '100%', textAlign: 'left',
              }}
              onMouseEnter={e => e.currentTarget.style.color = GROUP_COLORS[group]}
              onMouseLeave={e => e.currentTarget.style.color = '#aaa'}
            >
              <Plus size={13} /> New task
            </button>
          </div>
        )
      })}
    </div>
  )
}
