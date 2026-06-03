import React from 'react'
import { Link } from 'react-router-dom'

type ButtonAsButton = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  as?: 'button'
  href?: never
  to?: never
}

type ButtonAsAnchor = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  as: 'a'
  href?: string
  to?: never
}

type ButtonAsLink = {
  as: 'link'
  to: string
  href?: never
  className?: string
  children?: React.ReactNode
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
}

type ButtonProps = (ButtonAsButton | ButtonAsAnchor | ButtonAsLink) & {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  variant = 'primary',
  size = 'md',
  as: Tag = 'button',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-semibold tracking-widest uppercase transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]'

  const variants = {
    primary: 'bg-[var(--color-gold-cta)] text-[var(--color-navy)] hover:brightness-110',
    secondary: 'border border-[var(--color-gold-cta)] text-[var(--color-gold-cta)] hover:bg-[var(--color-gold-muted)]',
  }

  const sizes = {
    sm: 'text-[10px] px-4 py-2 rounded-sm',
    md: 'text-[11px] px-6 py-3 rounded-sm',
    lg: 'text-xs px-8 py-4 rounded-sm',
  }

  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`

  if (Tag === 'link') {
    const { to, onClick } = props as ButtonAsLink
    return <Link to={to} className={cls} onClick={onClick}>{children}</Link>
  }

  if (Tag === 'a') {
    return <a className={cls} {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>{children}</a>
  }

  return <button className={cls} {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>{children}</button>
}
