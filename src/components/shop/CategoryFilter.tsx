import type { ProductCategory } from '../../types/product'

const categories: Array<'All' | ProductCategory> = ['All', 'Ebook', 'SOP', 'Toolkit', 'Training']

interface CategoryFilterProps {
  active: 'All' | ProductCategory
  onChange: (cat: 'All' | ProductCategory) => void
}

export function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`text-[10px] tracking-widest uppercase px-4 py-2 rounded-sm border transition-colors ${
            active === cat
              ? 'bg-[var(--color-gold)] text-[var(--color-bg)] border-[var(--color-gold)]'
              : 'border-[var(--color-gold-muted)] text-[var(--color-text-muted)] hover:border-[var(--color-gold)] hover:text-[var(--color-text)]'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
