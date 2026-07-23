"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface DashboardTileProps {
  icon: ReactNode
  label: string
  value: string | ReactNode
  sublabel?: string
  className?: string
  onClick?: () => void
}

export function DashboardTile({ icon, label, value, sublabel, className, onClick }: DashboardTileProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "glass-card flex flex-col gap-3 rounded-xl p-4 transition-all duration-300",
        onClick && "cursor-pointer hover:scale-[1.02] active:scale-[0.98]",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-xl font-bold text-foreground">{value}</div>
      {sublabel && <span className="text-xs text-muted-foreground">{sublabel}</span>}
    </div>
  )
}
