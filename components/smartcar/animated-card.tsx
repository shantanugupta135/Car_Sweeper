'use client'

import React, { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface AnimatedCardProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'hover-glow' | 'pulse' | 'float'
  delay?: number
  onClick?: () => void
}

export function AnimatedCard({
  children,
  className,
  variant = 'default',
  delay = 0,
  onClick,
}: AnimatedCardProps) {
  const variantClasses = {
    default: 'animate-slide-in-bottom',
    'hover-glow': 'animate-slide-in-bottom hover:animate-glow-pulse',
    pulse: 'animate-slide-in-bottom animate-glow-pulse',
    float: 'animate-slide-in-bottom animate-bounce-subtle',
  }

  const delayClass = delay > 0 ? `animation-delay-${Math.min(delay, 1000)}` : ''

  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card/50 backdrop-blur-sm p-6 transition-smooth',
        'hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10',
        variantClasses[variant],
        delayClass,
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  )
}
