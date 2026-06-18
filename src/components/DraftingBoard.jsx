import { useState, useRef, useEffect } from 'react'
import { Plus, X, ChevronDown, Copy, Trash2, ArrowRight, GripVertical } from 'lucide-react'
import CategoryBadge from './CategoryBadge'
import TaskPanel from './TaskPanel'

const STATUSES = [
  { label: 'Not Started',      bg: '#c4c4c4', text: '#444' },
  { label: 'Working on it',    bg: '#FDAB3D', text: '#7a4800' },
  { label: 'Stuck',            bg: '#E2445C', text: '#fff' },
  { label: 'Done',             bg: '#00C875', text: '#fff' },
  { label: 'Issued to Engg',   bg: '#0096c7', text: '#fff' },
  { label: 'Issued to PM',     bg: '#7F77DD', text: '#fff' },
  { label: 'Waiting for Info', bg: '#ffcb00', text: '#7a5c00' },
]
const PRIORITIES = ['', 'Critical', 'High', 'Medium', 'Low']
const PRIORITY_COLORS = { Critical: '#E2445C', High: '#FDAB3D', Medium: '#0096c7', Low: '#c4c4c4' }
const GROUPS = ['To-Do', 'Waiting for Information', 'Completed no further action required']
const GROUP_COLORS = { 'To-Do': '#7F77DD', 'Waiting for Information': '#FDAB3D', 'Completed no further action required': '#00C875' }

// Draggable columns — fixed columns (colourBar, checkbox, delete) are always pinned
const DEFAULT_COL_ORDER = ['title', 'owner', 'status', 'due', 'priority', 'notes', 'category', 'timeline']
const COL_DEF = {
  title:    { label: 'Task',               width: '2fr'  },
  owner:    { label: 'Draftee', width: '110px' },
  status:   { label: 'Status',             width: '140px' },
  due:      { label: 'Due Date',           width: '100px' },
  priority: { label: 'Priority',           width: '100px' },
  notes:    { label: 'Notes',              width: '2fr'  },
  category: { label: 'Category',           width: '110px' },
  timeline: { label: 'Timeline',           width: '170px' },
}

const actionBtn = {
  background: 'rgba(255,255,255,0.08)', border: '0.5px solid rgba(255,255,255,0.15)',
  borderRadius: 7, color: 'white', cursor: 'pointer', fontSize: 12, fontWeight: 500,
  padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 5,
}

const COL_TYPES = [
  { type: 'text',     label: 'Text',     icon: '📝', color: '#0096c7', desc: 'Free text field' },
  { type: 'number',   label: 'Numbers',  icon: '#',  color: '#00C875', desc: 'Numeric values' },
  { type: 'date',     label: 'Date',     icon: '📅', color: '#FDAB3D', desc: 'Date picker' },
  { type: 'people',   label: 'People',   icon: '👤', color: '#7F77DD', desc: 'Team member name' },
  { type: 'checkbox', label: 'Checkbox', icon: '✓',  color: '#00C875', desc: 'Yes / No toggle' },
  { type: 'status',   label: 'Status',   icon: '◉',  color: '#E2445C', desc: 'Status dropdown' },
  { type: 'dropdown', label: 'Dropdown', icon: '▾',  color: '#FDAB3D', desc: 'Custom options' },
  { type: 'priority', label: 'Priority', icon: '⚑',  color: '#E2445C', desc: 'Priority level' },
]

/* ── small sub-components ── */
function StatusPill({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef()
  const current = STATUSES.find(s => s.label === value) || STATUSES[0]
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h)
  }, [])
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        background: current.bg, color: current.text, border: 'none', borderRadius: 4,
        padding: '4px 10px', fontSize: 11, fontWeight: 600, cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap',
        minWidth: 110, justifyContent: 'space-between',
      }}>
        {current.label}<ChevronDown size={11} />
      </button>
      {open && (
        <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 200, background: 'white', border: '0.5px solid #e0dfd8', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.12)', padding: 6, minWidth: 160, marginTop: 4 }}>
          {STATUSES.map(s => (
            <button key={s.label} onClick={() => { onChange(s.label); setOpen(false) }}
              style={{ display: 'block', width: '100%', textAlign: 'left', background: s.bg, color: s.text, border: 'none', borderRadius: 4, padding: '5px 10px', fontSize: 11, fontWeight: 600, cursor: 'pointer', marginBottom: 4 }}>
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
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h)
  }, [])
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: value ? PRIORITY_COLORS[value] : '#bbb', fontWeight: value ? 600 : 400, padding: '2px 0' }}>
        {value || '—'}
      </button>
      {open && (
        <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 200, background: 'white', border: '0.5px solid #e0dfd8', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.12)', padding: 6, minWidth: 120, marginTop: 4 }}>
          {PRIORITIES.map(p => (
            <button key={p} onClick={() => { onChange(p); setOpen(false) }}
              style={{ display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '5px 10px', fontSize: 11, cursor: 'pointer', color: p ? PRIORITY_COLORS[p] : '#888', fontWeight: p ? 600 : 400, borderRadius: 4 }}>
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
  useEffect(() => { setVal(value) }, [value])
  if (editing) return (
    <input autoFocus value={val}
      onChange={e => setVal(e.target.value)}
      onBlur={() => { onChange(val); setEditing(false) }}
      onKeyDown={e => { if (e.key === 'Enter') { onChange(val); setEditing(false) } }}
      style={{ border: 'none', outline: '1px solid #7F77DD', borderRadius: 3, padding: '2px 6px', fontSize: 12, width: '100%', background: '#f8f7ff' }}
    />
  )
  return (
    <span onClick={() => setEditing(true)}
      style={{ fontSize: 12, color: value ? '#1a1a1a' : '#bbb', cursor: 'text', display: 'block', minHeight: 20, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
      {value || placeholder}
    </span>
  )
}

/* ── main component ── */
export default function DraftingBoard({ cards, setCards }) {
  const [activeCard, setActiveCard] = useState(null)
  const [selected, setSelected] = useState(new Set())
  const [moveOpen, setMoveOpen] = useState(false)
  const [dragId, setDragId] = useState(null)       // row drag
  const [dragOver, setDragOver] = useState(null)   // group drop target
  const [colOrder, setColOrder] = useState(DEFAULT_COL_ORDER)
  const [customCols, setCustomCols] = useState({})
  const [dragColIdx, setDragColIdx] = useState(null)
  const [dragColOverIdx, setDragColOverIdx] = useState(null)
  const [addColOpen, setAddColOpen] = useState(false)
  const [colSearch, setColSearch] = useState('')
  const moveRef = useRef()
  const addColRef = useRef()

  useEffect(() => {
    const h = (e) => {
      if (moveRef.current && !moveRef.current.contains(e.target)) setMoveOpen(false)
      if (addColRef.current && !addColRef.current.contains(e.target)) setAddColOpen(false)
    }
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h)
  }, [])

  const addColumn = (type) => {
    const id = `custom_${Date.now()}`
    const typeLabel = COL_TYPES.find(t => t.type === type)?.label || 'Column'
    setCustomCols(prev => ({ ...prev, [id]: { label: typeLabel, type, width: '120px' } }))
    setColOrder(prev => [...prev, id])
    setAddColOpen(false)
    setColSearch('')
  }

  /* panel */
  const openPanel = (card) => setActiveCard(card)
  const closePanel = () => setActiveCard(null)
  const updateCardFull = (updated) => {
    setCards(prev => prev.map(c => c.id === updated.id ? updated : c))
    setActiveCard(updated)
  }

  /* row selection */
  const toggleSelect = (id) => setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  const clearSelected = () => setSelected(new Set())
  const duplicateSelected = () => {
    const duped = cards.filter(c => selected.has(c.id)).map(c => ({ ...c, id: Date.now() + Math.random(), title: c.title + ' (copy)', checked: false }))
    setCards(prev => [...prev, ...duped]); clearSelected()
  }
  const deleteSelected = () => { setCards(prev => prev.filter(c => !selected.has(c.id))); clearSelected() }
  const moveSelected = (group) => { setCards(prev => prev.map(c => selected.has(c.id) ? { ...c, group } : c)); setMoveOpen(false); clearSelected() }

  /* row drag-to-group */
  const onRowDragStart = (e, id) => { setDragId(id); e.dataTransfer.effectAllowed = 'move' }
  const onDropGroup = (e, group) => {
    e.preventDefault()
    if (dragId) { setCards(prev => prev.map(c => c.id === dragId ? { ...c, group } : c)); setDragId(null) }
    setDragOver(null)
  }

  /* column drag-to-reorder */
  const onColDragStart = (e, idx) => { setDragColIdx(idx); e.dataTransfer.effectAllowed = 'move' }
  const onColDragOver = (e, idx) => { e.preventDefault(); setDragColOverIdx(idx) }
  const onColDrop = (e, idx) => {
    e.preventDefault()
    if (dragColIdx === null || dragColIdx === idx) { setDragColIdx(null); setDragColOverIdx(null); return }
    const next = [...colOrder]
    const [moved] = next.splice(dragColIdx, 1)
    next.splice(idx, 0, moved)
    setColOrder(next)
    setDragColIdx(null); setDragColOverIdx(null)
  }

  const addRow = (group) => {
    setCards(prev => [...prev, { id: Date.now(), title: '', group, category: 'Drawing', owner: '', due: '', timelineStart: '', timelineEnd: '', priority: '', notes: '', draftStatus: 'Not Started' }])
  }
  const update = (id, field, value) => setCards(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c))
  const remove = (id) => setCards(prev => prev.filter(c => c.id !== id))

  const migrate = (cs) => cs.map(c => ({
    ...c,
    group: c.group || 'To-Do', draftStatus: c.draftStatus || 'Not Started',
    notes: c.notes || '', priority: c.priority || '',
    timelineStart: c.timelineStart || '', timelineEnd: c.timelineEnd || '',
    checked: c.checked || false,
  }))
  const migrated = migrate(cards)

  /* grid template from current column order */
  const gridCols = `28px 28px ${colOrder.map(k => allColDefs[k]?.width || '120px').join(' ')} 28px`

  /* render a single cell for a given column key */
  const renderCell = (key, card) => {
    switch (key) {
      case 'title': return (
        <div style={{ padding: '6px 8px', overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 6 }}>
          <InlineEdit value={card.title} onChange={v => update(card.id, 'title', v)} placeholder="Task name..." />
          <button onClick={e => { e.stopPropagation(); openPanel(migrated.find(c => c.id === card.id)) }}
            title="Open updates"
            style={{ flexShrink: 0, background: 'none', border: '0.5px solid #e0dfd8', borderRadius: 5, cursor: 'pointer', padding: '2px 5px', fontSize: 10, color: '#aaa', display: 'flex', alignItems: 'center', gap: 3 }}
            onMouseEnter={e => { e.currentTarget.style.color = '#7F77DD'; e.currentTarget.style.borderColor = '#7F77DD' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#aaa'; e.currentTarget.style.borderColor = '#e0dfd8' }}
          >
            💬{(card.updates || []).length > 0 ? ` ${card.updates.length}` : ''}
          </button>
        </div>
      )
      case 'owner': return <div style={{ padding: '6px 8px' }}><InlineEdit value={card.owner} onChange={v => update(card.id, 'owner', v)} placeholder="—" /></div>
      case 'status': return <div style={{ padding: '6px 8px' }}><StatusPill value={card.draftStatus} onChange={v => update(card.id, 'draftStatus', v)} /></div>
      case 'due': return <div style={{ padding: '6px 8px' }}><InlineEdit value={card.due} onChange={v => update(card.id, 'due', v)} placeholder="—" /></div>
      case 'priority': return <div style={{ padding: '6px 8px' }}><PriorityCell value={card.priority} onChange={v => update(card.id, 'priority', v)} /></div>
      case 'notes': return <div style={{ padding: '6px 8px' }}><InlineEdit value={card.notes} onChange={v => update(card.id, 'notes', v)} placeholder="Add note..." /></div>
      case 'category': return <div style={{ padding: '6px 8px' }}><CategoryBadge category={card.category} /></div>
      case 'timeline': return (
        <div style={{ padding: '6px 8px', display: 'flex', alignItems: 'center', gap: 4 }}>
          <InlineEdit value={card.timelineStart} onChange={v => update(card.id, 'timelineStart', v)} placeholder="Start" />
          <span style={{ color: '#ccc', fontSize: 10 }}>→</span>
          <InlineEdit value={card.timelineEnd} onChange={v => update(card.id, 'timelineEnd', v)} placeholder="End" />
        </div>
      )
      default: {
        // custom column
        const colDef = customCols[key]
        if (!colDef) return null
        const val = (card.customData || {})[key] || ''
        const setVal = (v) => update(card.id, 'customData', { ...(card.customData || {}), [key]: v })
        if (colDef.type === 'checkbox') return (
          <div style={{ padding: '6px 8px', display: 'flex', alignItems: 'center' }}>
            <input type="checkbox" checked={!!val} onChange={e => setVal(e.target.checked)}
              style={{ width: 15, height: 15, accentColor: '#00C875', cursor: 'pointer' }} />
          </div>
        )
        if (colDef.type === 'status') return <div style={{ padding: '6px 8px' }}><StatusPill value={val || 'Not Started'} onChange={setVal} /></div>
        if (colDef.type === 'priority') return <div style={{ padding: '6px 8px' }}><PriorityCell value={val} onChange={setVal} /></div>
        return <div style={{ padding: '6px 8px' }}><InlineEdit value={val} onChange={setVal} placeholder="—" /></div>
      }
    }
  }

  /* merged column definitions (built-in + custom) */
  const allColDefs = { ...COL_DEF, ...customCols }

  /* shared header row renderer */
  const renderHeaderRow = (isGlobal = false) => (
    <div style={{
      display: 'grid', gridTemplateColumns: gridCols,
      borderTop: isGlobal ? '1.5px solid #e0dfd8' : undefined,
      borderBottom: '0.5px solid #e0dfd8',
      background: isGlobal ? 'white' : '#f7f7f5',
      position: isGlobal ? 'sticky' : 'sticky',
      top: 0,
      zIndex: isGlobal ? 20 : 10,
      boxShadow: isGlobal ? '0 2px 8px rgba(0,0,0,0.06)' : undefined,
    }}>
      <div style={{ borderRight: '0.5px solid #e8e7e0' }} />
      <div style={{ borderRight: '0.5px solid #e8e7e0' }} />
      {colOrder.map((key, ci) => (
        <div key={key}
          draggable
          onDragStart={e => { e.stopPropagation(); onColDragStart(e, ci) }}
          onDragOver={e => { e.stopPropagation(); onColDragOver(e, ci) }}
          onDrop={e => { e.stopPropagation(); onColDrop(e, ci) }}
          onDragEnd={() => { setDragColIdx(null); setDragColOverIdx(null) }}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '6px 8px', cursor: 'grab', userSelect: 'none',
            borderRight: '0.5px solid #e8e7e0',
            borderLeft: dragColOverIdx === ci && dragColIdx !== ci ? '2px solid #7F77DD' : '2px solid transparent',
            background: dragColIdx === ci ? '#eeeeff' : 'transparent',
            transition: 'background 0.1s',
          }}>
          <GripVertical size={10} color="#ccc" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: '#888', letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
            {allColDefs[key]?.label || key}
          </span>
        </div>
      ))}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }} ref={isGlobal ? addColRef : null}>
        {isGlobal && (
          <>
            <button
              onClick={() => setAddColOpen(o => !o)}
              title="Add column"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', display: 'flex', alignItems: 'center', padding: 4, borderRadius: 4 }}
              onMouseEnter={e => { e.currentTarget.style.background = '#eee'; e.currentTarget.style.color = '#7F77DD' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#aaa' }}
            >
              <Plus size={14} />
            </button>
            {addColOpen && (
              <div style={{ position: 'fixed', zIndex: 500, background: 'white', border: '0.5px solid #e0dfd8', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.18)', padding: 16, width: 320, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f5f4f0', borderRadius: 8, padding: '7px 12px', marginBottom: 14 }}>
                  <span style={{ fontSize: 14, color: '#bbb' }}>🔍</span>
                  <input autoFocus value={colSearch} onChange={e => setColSearch(e.target.value)} placeholder="Search or describe your column"
                    style={{ border: 'none', background: 'none', outline: 'none', fontSize: 13, flex: 1, color: '#1a1a1a' }} />
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#aaa', letterSpacing: '0.08em', marginBottom: 8, textTransform: 'uppercase' }}>Column types</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  {COL_TYPES.filter(t => !colSearch || t.label.toLowerCase().includes(colSearch.toLowerCase())).map(t => (
                    <button key={t.type} onClick={() => addColumn(t.type)}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', border: '0.5px solid #e0dfd8', borderRadius: 8, cursor: 'pointer', background: 'white', textAlign: 'left' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#f5f4f0'; e.currentTarget.style.borderColor = t.color }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#e0dfd8' }}>
                      <div style={{ width: 30, height: 30, borderRadius: 7, background: `${t.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: t.color, fontWeight: 700, flexShrink: 0 }}>{t.icon}</div>
                      <div><div style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a' }}>{t.label}</div><div style={{ fontSize: 10, color: '#aaa' }}>{t.desc}</div></div>
                    </button>
                  ))}
                </div>
                <button onClick={() => setAddColOpen(false)} style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', cursor: 'pointer', color: '#bbb' }}><X size={14} /></button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )

  return (
    <div>

      {/* ── Global sticky header ── */}
      {renderHeaderRow(true)}

      {/* ── Bottom action bar ── */}
      {selected.size > 0 && (
        <div style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', background: '#1a1a2e', color: 'white', borderRadius: 12, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 8px 32px rgba(0,0,0,0.28)', zIndex: 300, whiteSpace: 'nowrap' }}>
          <div style={{ background: '#7F77DD', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, marginRight: 6 }}>{selected.size}</div>
          <span style={{ fontSize: 13, fontWeight: 500, marginRight: 16 }}>{selected.size === 1 ? 'Task selected' : `${selected.size} tasks selected`}</span>
          <button onClick={duplicateSelected} style={actionBtn}><Copy size={14} /> Duplicate</button>
          <div ref={moveRef} style={{ position: 'relative' }}>
            <button onClick={() => setMoveOpen(o => !o)} style={actionBtn}><ArrowRight size={14} /> Move to</button>
            {moveOpen && (
              <div style={{ position: 'absolute', bottom: '110%', left: 0, background: 'white', border: '0.5px solid #e0dfd8', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.15)', padding: 6, minWidth: 240 }}>
                {GROUPS.map(g => (
                  <button key={g} onClick={() => moveSelected(g)} style={{ display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '7px 12px', fontSize: 12, cursor: 'pointer', color: '#1a1a1a', borderRadius: 4 }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f5f4f0'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                    <span style={{ width: 10, height: 10, borderRadius: 2, background: GROUP_COLORS[g], display: 'inline-block', marginRight: 8, verticalAlign: 'middle' }} />{g}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={deleteSelected} style={{ ...actionBtn, color: '#ff7575' }}><Trash2 size={14} /> Delete</button>
          <button onClick={clearSelected} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', marginLeft: 8, padding: 4, display: 'flex', alignItems: 'center' }}><X size={14} /></button>
        </div>
      )}

      {/* ── Groups ── */}
      {GROUPS.map(group => {
        const groupCards = migrated.filter(c => c.group === group)
        return (
          <div key={group} style={{ marginBottom: 28 }}
            onDragOver={e => { e.preventDefault(); if (dragId) setDragOver(group) }}
            onDragLeave={() => setDragOver(null)}
            onDrop={e => onDropGroup(e, group)}
          >
            {/* Group title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 0 0 0', marginBottom: 0, background: dragOver === group && dragId ? `${GROUP_COLORS[group]}18` : 'transparent', transition: 'background 0.15s', borderRadius: 4 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: GROUP_COLORS[group], display: 'inline-block', flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: GROUP_COLORS[group] }}>{group}</span>
              <span style={{ fontSize: 11, color: '#aaa', marginLeft: 2 }}>{groupCards.length}</span>
              {dragOver === group && dragId && <span style={{ fontSize: 11, color: GROUP_COLORS[group], marginLeft: 8, fontWeight: 600 }}>Drop here ↓</span>}
            </div>

            {/* Per-group sub-header (thinner, coloured top border) */}
            <div style={{ display: 'grid', gridTemplateColumns: gridCols, borderTop: `2px solid ${GROUP_COLORS[group]}`, borderBottom: '0.5px solid #e0dfd8', background: '#f7f7f5' }}>
              <div /><div />
              {colOrder.map(key => (
                <div key={key} style={{ padding: '3px 8px', fontSize: 9, fontWeight: 700, color: '#bbb', letterSpacing: '0.05em', textTransform: 'uppercase', borderRight: '0.5px solid #e8e7e0', whiteSpace: 'nowrap' }}>
                  {allColDefs[key]?.label || key}
                </div>
              ))}
              <div />
            </div>

            {/* Data rows */}
            {groupCards.map((card, idx) => (
              <div key={card.id}
                draggable
                onDragStart={e => onRowDragStart(e, card.id)}
                onDragEnd={() => { setDragId(null); setDragOver(null) }}
                style={{
                  display: 'grid', gridTemplateColumns: gridCols,
                  alignItems: 'center', borderBottom: '0.5px solid #f0efe9',
                  background: dragId === card.id ? '#e8e8ff' : selected.has(card.id) ? '#eeeeff' : idx % 2 === 0 ? 'white' : '#fafaf8',
                  minHeight: 38, opacity: dragId === card.id ? 0.5 : 1, cursor: 'grab',
                }}
                onMouseEnter={e => { if (!selected.has(card.id) && dragId !== card.id) e.currentTarget.style.background = '#f5f4f0' }}
                onMouseLeave={e => { if (!selected.has(card.id) && dragId !== card.id) e.currentTarget.style.background = idx % 2 === 0 ? 'white' : '#fafaf8' }}
              >
                {/* colour bar */}
                <div style={{ width: 4, height: '100%', background: GROUP_COLORS[group], borderRadius: '2px 0 0 2px', alignSelf: 'stretch' }} />
                {/* checkbox */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>
                  <input type="checkbox" checked={selected.has(card.id)} onChange={() => toggleSelect(card.id)}
                    style={{ width: 15, height: 15, cursor: 'pointer', accentColor: '#7F77DD' }} />
                </div>
                {/* dynamic columns */}
                {colOrder.map(key => (
                  <div key={key} style={{ borderRight: '0.5px solid #f0efe9', minWidth: 0 }}>
                    {renderCell(key, card)}
                  </div>
                ))}
                {/* delete */}
                <div style={{ padding: '6px 4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <button onClick={() => remove(card.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', padding: 2, display: 'flex', alignItems: 'center' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#E2445C'}
                    onMouseLeave={e => e.currentTarget.style.color = '#ccc'}>
                    <X size={13} />
                  </button>
                </div>
              </div>
            ))}

            {/* Add row */}
            <button onClick={() => addRow(group)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', fontSize: 12, padding: '7px 36px', width: '100%', textAlign: 'left' }}
              onMouseEnter={e => e.currentTarget.style.color = GROUP_COLORS[group]}
              onMouseLeave={e => e.currentTarget.style.color = '#aaa'}>
              <Plus size={13} /> New task
            </button>
          </div>
        )
      })}

      {/* Task panel */}
      {activeCard && (
        <>
          <div onClick={closePanel} style={{ position: 'fixed', inset: 0, zIndex: 199, background: 'rgba(0,0,0,0.15)' }} />
          <TaskPanel
            card={migrated.find(c => c.id === activeCard.id) || activeCard}
            onClose={closePanel}
            onUpdateCard={updateCardFull}
            currentUser="AH"
          />
        </>
      )}
    </div>
  )
}
