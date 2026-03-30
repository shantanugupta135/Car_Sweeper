"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps {
  children: ReactNode
  className?: string
  glow?: boolean
  onClick?: () => void
}

export function GlassCard({ children, className, glow = false, onClick }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
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
