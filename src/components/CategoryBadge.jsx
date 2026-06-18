import { CATEGORY_STYLES } from '../lib/data'

export default function CategoryBadge({ category }) {
  const style = CATEGORY_STYLES[category] || { bg: '#F1EFE8', color: '#444441' }
  return (
    <span style={{
      background: style.bg,
      color: style.color,
      borderRadius: 3,
      padding: '2px 6px',
      fontSize: 10,
      fontWeight: 500,
      whiteSpace: 'nowrap',
    }}>
      {category}
    </span>
  )
}
