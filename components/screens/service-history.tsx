"use client"

import { ArrowLeft, Star, Car, AlertTriangle } from "lucide-react"
import { GlassCard } from "@/components/smartcar/glass-card"
import { useNavigation } from "@/lib/navigation-context"
import { serviceHistory } from "@/lib/mock-data"

export function ServiceHistoryScreen() {
  const { goBack } = useNavigation()

  const groupByDate = (entries: typeof serviceHistory) => {
    const groups: Record<string, typeof serviceHistory> = {}
    entries.forEach((entry) => {
      const date = new Date(entry.date).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
      if (!groups[date]) groups[date] = []
      groups[date].push(entry)
    })
    return groups
  }

  const grouped = groupByDate(serviceHistory)

  return (
    <div className="flex flex-col gap-6 px-4 pb-8 pt-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={goBack}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground transition-all active:scale-95"
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="text-lg font-bold text-foreground">Service History</h1>
      </div>

      {/* Stats Bar */}
      <div className="flex gap-3">
        <GlassCard className="flex-1 text-center">
          <p className="text-2xl font-bold text-foreground">
            {serviceHistory.filter((s) => s.status === "completed").length}
          </p>
          <p className="text-xs text-muted-foreground">Completed</p>
        </GlassCard>
        <GlassCard className="flex-1 text-center">
          <p className="text-2xl font-bold text-foreground">
            {(
              serviceHistory.filter((s) => s.rating > 0).reduce((acc, s) => acc + s.rating, 0) /
              serviceHistory.filter((s) => s.rating > 0).length
            ).toFixed(1)}
          </p>
          <p className="text-xs text-muted-foreground">Avg Rating</p>
        </GlassCard>
        <GlassCard className="flex-1 text-center">
          <p className="text-2xl font-bold text-foreground">
            {serviceHistory.filter((s) => s.status === "missed").length}
          </p>
          <p className="text-xs text-muted-foreground">Missed</p>
        </GlassCard>
      </div>

      {/* Timeline */}
      <div className="flex flex-col gap-5">
        {Object.entries(grouped).map(([date, entries]) => (
          <div key={date}>
            <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{date}</p>
            <div className="flex flex-col gap-2">
              {entries.map((entry) => (
                <GlassCard key={entry.id} className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                      entry.status === "completed"
                        ? "bg-emerald-400/10 text-emerald-400"
                        : "bg-amber-400/10 text-amber-400"
                    }`}
                  >
                    {entry.status === "completed" ? (
                      <Car className="h-4 w-4" />
                    ) : (
                      <AlertTriangle className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">{entry.type}</p>
                      {entry.rating > 0 && (
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < entry.rating ? "fill-amber-400 text-amber-400" : "text-secondary"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {entry.time} - {entry.cleaner}
                    </p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
