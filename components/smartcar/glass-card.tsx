"use client"

import type { ReactNode, CSSProperties } from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps {
  children: ReactNode
  className?: string
  glow?: boolean
  onClick?: () => void
  style?: CSSProperties
}

export function GlassCard({ children, className, glow = false, onClick, style }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      style={style}
      className={cn(
        "glass-card rounded-xl p-4 transition-all duration-300",
        glow && "animate-pulse-glow",
        onClick && "cursor-pointer hover:scale-[1.02] active:scale-[0.98]",
        className
      )}
    >
      {children}
    </div>
  )
}
