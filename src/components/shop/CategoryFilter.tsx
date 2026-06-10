import { useTranslation } from 'react-i18next'
import type { ShopFilter } from '../../types/product'

const FILTER_VALUES: ShopFilter[] = ['All', 'Free', 'Ebook', 'SOP', 'Toolkit', 'Training']

interface CategoryFilterProps {
  active: ShopFilter
  onChange: (filter: ShopFilter) => void
}

export function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  const { t } = useTranslation()

  const label = (f: ShopFilter) => {
    if (f === 'All') return t('shop.filterAll')
    if (f === 'Free') return t('shop.filterFree', { defaultValue: 'Free' })
    return t(`shop.categories.${f}`, { defaultValue: f })
  }

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {FILTER_VALUES.map(f => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={`text-[10px] tracking-widest uppercase px-4 py-2 rounded-sm border transition-colors ${
            active === f
              ? 'bg-[var(--color-gold)] text-[var(--color-bg)] border-[var(--color-gold)]'
              : 'border-[var(--color-gold-muted)] text-[var(--color-text-muted)] hover:border-[var(--color-gold)] hover:text-[var(--color-text)]'
          }`}
        >
          {label(f)}
        </button>
      ))}
    </div>
  )
}
