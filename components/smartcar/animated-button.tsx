"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface AnimatedButtonProps {
  children: ReactNode
  className?: string
  variant?: "primary" | "secondary" | "ghost"
  size?: "sm" | "md" | "lg"
  onClick?: () => void
  disabled?: boolean
}

export function AnimatedButton({
  children,
  className,
  variant = "primary",
  size = "md",
  onClick,
  disabled = false,
}: AnimatedButtonProps) {
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 glow",
    secondary: "glass-card text-foreground hover:bg-secondary/80",
    ghost: "bg-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/50",
  }

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-base",
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-lg font-medium transition-all duration-200 active:scale-[0.95] disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </button>
  )
}
