interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  as?: 'button' | 'a'
  href?: string
}

export function Button({
  variant = 'primary',
  size = 'md',
  as: Tag = 'button',
  href,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-semibold tracking-widest uppercase transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]'

  const variants = {
    primary: 'bg-[var(--color-gold)] text-[var(--color-bg)] hover:brightness-110',
    secondary: 'border border-[var(--color-gold)] text-[var(--color-gold)] hover:bg-[var(--color-gold-muted)]',
  }

  const sizes = {
    sm: 'text-[10px] px-4 py-2 rounded-sm',
    md: 'text-[11px] px-6 py-3 rounded-sm',
    lg: 'text-xs px-8 py-4 rounded-sm',
  }

  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`

  if (Tag === 'a') {
    return <a href={href} className={cls}>{children}</a>
  }

  return <button className={cls} {...props}>{children}</button>
}
