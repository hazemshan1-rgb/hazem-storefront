interface GoldBadgeProps {
  label: string
}

export function GoldBadge({ label }: GoldBadgeProps) {
  return (
    <span className="inline-block px-2 py-0.5 text-[10px] tracking-widest uppercase font-semibold border border-[var(--color-gold)] text-[var(--color-gold)] rounded-sm">
      {label}
    </span>
  )
}
