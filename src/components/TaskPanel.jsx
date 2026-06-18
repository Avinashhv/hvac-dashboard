import { useState, useRef, useEffect } from 'react'
import { X, Send, CornerDownRight } from 'lucide-react'

const AVATAR_COLORS = ['#7F77DD', '#0096c7', '#00C875', '#FDAB3D', '#E2445C', '#FF7575', '#225091']

function getAvatarColor(name) {
  if (!name) return '#c4c4c4'
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function Avatar({ name, size = 30 }) {
  const initials = name ? name.slice(0, 2).toUpperCase() : '?'
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: getAvatarColor(name), color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.38, fontWeight: 600, flexShrink: 0,
    }}>
      {initials}
    </div>
  )
}

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('en-AU', { month: 'short', year: 'numeric' })
}

function ReplyBox({ onSend }) {
  const [text, setText] = useState('')
  return (
    <div style={{ display: 'flex', gap: 8, marginTop: 8, paddingLeft: 36 }}>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' && text.trim()) { onSend(text.trim()); setText('') } }}
        placeholder="Write a reply and mention others with @"
        style={{
          flex: 1, border: '0.5px solid #e0dfd8', borderRadius: 6,
          padding: '7px 10px', fontSize: 12, outline: 'none',
          fontFamily: 'inherit', background: '#fafaf8',
        }}
      />
      <button
        onClick={() => { if (text.trim()) { onSend(text.trim()); setText('') } }}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7F77DD', padding: 4 }}
      >
        <Send size={14} />
      </button>
    </div>
  )
}

function UpdateItem({ update, onReply }) {
  const [showReply, setShowReply] = useState(false)
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', gap: 10 }}>
        <Avatar name={update.author} size={32} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{update.author || 'Unknown'}</span>
            <span style={{ fontSize: 11, color: '#aaa' }}>{formatDate(update.date)}</span>
          </div>
          <div style={{
            background: '#f5f4f0', borderRadius: 8, padding: '10px 12px',
            fontSize: 13, color: '#1a1a1a', lineHeight: 1.5,
          }}>
            {update.text}
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
            <button
              onClick={() => setShowReply(r => !r)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: '#888', display: 'flex', alignItems: 'center', gap: 4, padding: 0 }}
            >
              <CornerDownRight size={11} /> Reply
            </button>
          </div>
          {/* Replies */}
          {update.replies && update.replies.map(r => (
            <div key={r.id} style={{ display: 'flex', gap: 8, marginTop: 10, paddingLeft: 8 }}>
              <Avatar name={r.author} size={24} />
              <div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 3 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a' }}>{r.author}</span>
                  <span style={{ fontSize: 11, color: '#aaa' }}>{formatDate(r.date)}</span>
                </div>
                <div style={{ background: '#f5f4f0', borderRadius: 6, padding: '7px 10px', fontSize: 12, color: '#1a1a1a' }}>
                  {r.text}
                </div>
              </div>
            </div>
          ))}
          {showReply && (
            <ReplyBox onSend={(text) => { onReply(update.id, text); setShowReply(false) }} />
          )}
        </div>
      </div>
    </div>
  )
}

export default function TaskPanel({ card, onClose, onUpdateCard, currentUser = 'AH' }) {
  const [newText, setNewText] = useState('')
  const bottomRef = useRef()

  const updates = card.updates || []

  const addUpdate = () => {
    if (!newText.trim()) return
    const update = { id: Date.now(), author: currentUser, date: new Date().toISOString(), text: newText.trim(), replies: [] }
    onUpdateCard({ ...card, updates: [...updates, update] })
    setNewText('')
  }

  const addReply = (updateId, text) => {
    const reply = { id: Date.now(), author: currentUser, date: new Date().toISOString(), text }
    onUpdateCard({
      ...card,
      updates: updates.map(u => u.id === updateId ? { ...u, replies: [...(u.replies || []), reply] } : u)
    })
  }

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, bottom: 0, width: 420,
      background: 'white', borderLeft: '0.5px solid #e0dfd8',
      boxShadow: '-4px 0 24px rgba(0,0,0,0.10)',
      display: 'flex', flexDirection: 'column',
      zIndex: 200, fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
    }}>
      {/* Header */}
      <div style={{ padding: '16px 18px 0', borderBottom: '0.5px solid #e0dfd8', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: 2, display: 'flex' }}>
            <X size={16} />
          </button>
          <span style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {card.title || 'Untitled task'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 0, marginBottom: 0 }}>
          <div style={{
            fontSize: 12, fontWeight: 600, color: '#7F77DD',
            borderBottom: '2px solid #7F77DD', padding: '6px 12px 8px', cursor: 'pointer',
          }}>
            Updates {updates.length > 0 && <span style={{ fontSize: 11, color: '#aaa', fontWeight: 400 }}>/ {updates.length}</span>}
          </div>
        </div>
      </div>

      {/* New update box */}
      <div style={{ padding: '14px 18px', borderBottom: '0.5px solid #f0efe9', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <Avatar name={currentUser} size={32} />
          <div style={{ flex: 1 }}>
            <textarea
              value={newText}
              onChange={e => setNewText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addUpdate() } }}
              placeholder="Write an update and mention others with @"
              rows={2}
              style={{
                width: '100%', border: '0.5px solid #e0dfd8', borderRadius: 8,
                padding: '8px 10px', fontSize: 12, outline: 'none', resize: 'none',
                fontFamily: 'inherit', background: '#fafaf8', boxSizing: 'border-box',
              }}
            />
            {newText.trim() && (
              <button
                onClick={addUpdate}
                style={{
                  marginTop: 6, background: '#7F77DD', color: 'white', border: 'none',
                  borderRadius: 6, padding: '6px 16px', fontSize: 12, fontWeight: 600,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
                }}
              >
                <Send size={12} /> Update
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Updates list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px' }}>
        {updates.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#bbb', fontSize: 12, marginTop: 40 }}>
            No updates yet — be the first to post!
          </div>
        ) : (
          [...updates].reverse().map(u => (
            <UpdateItem key={u.id} update={u} onReply={addReply} />
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
