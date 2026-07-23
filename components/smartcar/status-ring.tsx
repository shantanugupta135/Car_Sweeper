"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface StatusRingProps {
  progress: number
  size?: number
  strokeWidth?: number
  label?: string
  sublabel?: string
  className?: string
  status?: "waiting" | "cleaning" | "completed"
}

export function StatusRing({
  progress,
  size = 160,
  strokeWidth = 6,
  label,
  sublabel,
  className,
  status = "cleaning",
}: StatusRingProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0)
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedProgress(progress), 100)
    return () => clearTimeout(timer)
  }, [progress])

  const statusColor = {
    waiting: "stroke-[#F4A300]",
    cleaning: "stroke-primary",
    completed: "stroke-primary-dark",
  }

  const statusGlow = {
    waiting: "drop-shadow(0 0 6px #F4A300)",
    cleaning: "drop-shadow(0 0 6px #2E9E44)",
    completed: "drop-shadow(0 0 6px #166534)",
  }

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90" style={{ filter: statusGlow[status] }}>
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-secondary"
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={cn("transition-all duration-1000 ease-out", statusColor[status])}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        {label && <span className="text-2xl font-bold text-foreground">{label}</span>}
        {sublabel && <span className="text-xs text-muted-foreground">{sublabel}</span>}
      </div>
    </div>
  )
}
