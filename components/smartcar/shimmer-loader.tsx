"use client"

import { cn } from "@/lib/utils"

interface ShimmerLoaderProps {
  className?: string
}

export function ShimmerLoader({ className }: ShimmerLoaderProps) {
  return (
    <div className={cn("relative overflow-hidden rounded-xl bg-secondary", className)}>
      <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-muted-foreground/10 to-transparent" />
    </div>
  )
}
