'use client'

import { ReactNode } from 'react'
import { AnimatedCounter } from './animated-counter'
import { cn } from '@/lib/utils'

interface AnimatedStatProps {
  icon?: ReactNode
  label: string
  value: number
  suffix?: string
  prefix?: string
  sublabel?: string
  variant?: 'default' | 'highlight' | 'success'
  delay?: number
  onClick?: () => void
}

export function AnimatedStat({
  icon,
  label,
  value,
  suffix = '',
  prefix = '',
  sublabel,
  variant = 'default',
  delay = 0,
  onClick,
}: AnimatedStatProps) {
  const variantClasses = {
    default: 'bg-card/50 border-border hover:border-primary/30',
    highlight: 'bg-primary/10 border-primary/30 hover:border-primary/50',
    success: 'bg-emerald-400/10 border-emerald-400/30 hover:border-emerald-400/50',
  }

  const delayClass = delay > 0 ? `animation-delay-${Math.min(delay, 1000)}` : ''

  return (
    <div
      className={cn(
        'rounded-xl border p-4 backdrop-blur-sm transition-smooth animate-slide-in-bottom',
        'hover:shadow-lg hover:shadow-primary/10 cursor-pointer',
        variantClasses[variant],
        delayClass
      )}
      onClick={onClick}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          {icon && <div className="mb-2 text-primary">{icon}</div>}
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">{label}</p>
          <div className="text-2xl font-bold text-foreground">
            <AnimatedCounter from={0} to={value} duration={2} suffix={suffix} prefix={prefix} delay={delay + 200} />
          </div>
          {sublabel && <p className="text-xs text-muted-foreground mt-1">{sublabel}</p>}
        </div>
      </div>
    </div>
  )
}
