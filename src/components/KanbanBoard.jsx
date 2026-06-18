import { useState } from 'react'
import { Plus } from 'lucide-react'
import CategoryBadge from './CategoryBadge'
import CardModal from './CardModal'
import { STATUSES, STATUS_COLORS } from '../lib/data'

export default function KanbanBoard({ cards, setCards }) {
  const [editCard, setEditCard] = useState(null)
  const [addStatus, setAddStatus] = useState(null)

  const byStatus = (s) => cards.filter(c => c.status === s)

  const saveCard = (updated) => {
    setCards(prev => prev.map(c => c.id === updated.id ? updated : c))
    setEditCard(null)
  }

  const deleteCard = (id) => {
    setCards(prev => prev.filter(c => c.id !== id))
    setEditCard(null)
  }

  const addCard = (status) => {
    const newCard = {
      id: Date.now(),
      title: 'New item',
      status,
      category: 'Task',
      owner: '',
      due: '',
      pct: 0,
      overdue: false,
    }
    setCards(prev => [...prev, newCard])
    setEditCard(newCard)
    setAddStatus(null)
  }

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {STATUSES.map(status => (
          <div key={status}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 500, color: '#888', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: STATUS_COLORS[status], display: 'inline-block' }} />
                {status}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ background: '#f5f4f0', borderRadius: 10, padding: '1px 6px', fontSize: 10, color: '#888' }}>
                  {byStatus(status).length}
                </span>
                <button
                  onClick={() => addCard(status)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: 0, display: 'flex' }}
                  title="Add item"
                >
                  <Plus size={14} />
                </button>
              </span>
            </div>

            {byStatus(status).map(card => (
              <div
                key={card.id}
                onClick={() => setEditCard(card)}
                style={{
                  background: 'white',
                  border: '0.5px solid #e8e7e3',
                  borderRadius: 8,
                  padding: '9px 11px',
                  marginBottom: 7,
                  cursor: 'pointer',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#ccc'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#e8e7e3'}
              >
                <div style={{ fontSize: 12, fontWeight: 500, color: '#1a1a1a', marginBottom: 5, lineHeight: 1.35 }}>
                  {card.title}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
                  <CategoryBadge category={card.category} />
                  {card.owner && (
                    <span style={{ fontSize: 10, color: '#888' }}>{card.owner}</span>
                  )}
                  {card.due && (
                    <span style={{ fontSize: 10, color: card.overdue ? '#BA7517' : '#888' }}>
                      {card.overdue ? '⚠ ' : ''}{card.due}
                    </span>
                  )}
                </div>
                {card.pct > 0 && card.pct < 100 && (
                  <div style={{ height: 3, background: '#f0efe9', borderRadius: 2, marginTop: 6, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${card.pct}%`, background: STATUS_COLORS[status], borderRadius: 2 }} />
                  </div>
                )}
                {card.pct === 100 && (
                  <div style={{ height: 3, background: '#f0efe9', borderRadius: 2, marginTop: 6, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '100%', background: '#639922', borderRadius: 2 }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {editCard && (
        <CardModal
          card={editCard}
          onSave={saveCard}
          onDelete={deleteCard}
          onClose={() => setEditCard(null)}
        />
      )}
    </>
  )
}
