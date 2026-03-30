"use client"

import { cn } from "@/lib/utils"

interface ProgressIndicatorProps {
  steps: { label: string; completed: boolean; active?: boolean }[]
  className?: string
}

export function ProgressIndicator({ steps, className }: ProgressIndicatorProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-1">
          <div
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all duration-300",
              step.completed
                ? "bg-primary text-primary-foreground"
                : step.active
                  ? "bg-primary/20 text-primary ring-2 ring-primary/50"
                  : "bg-secondary text-muted-foreground"
            )}
          >
            {step.completed ? (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              i + 1
            )}
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                "h-0.5 w-6 rounded-full transition-all duration-300",
                step.completed ? "bg-primary" : "bg-secondary"
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}
