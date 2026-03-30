"use client"

import { useState } from "react"
import { ArrowLeft, Clock, AlertTriangle, Timer, Shield, User, HelpCircle, Check } from "lucide-react"
import { GlassCard } from "@/components/smartcar/glass-card"
import { AnimatedButton } from "@/components/smartcar/animated-button"
import { useNavigation } from "@/lib/navigation-context"
import { complaintIssues } from "@/lib/mock-data"

const iconMap: Record<string, typeof Clock> = {
  clock: Clock,
  alert: AlertTriangle,
  timer: Timer,
  shield: Shield,
  user: User,
  help: HelpCircle,
}

export function ComplaintScreen() {
  const { goBack, navigate } = useNavigation()
  const [selectedIssue, setSelectedIssue] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    setSubmitted(true)
    setTimeout(() => navigate("home"), 2000)
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 animate-pulse-glow">
          <Check className="h-10 w-10 text-primary" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Report Submitted</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We will investigate and get back to you within 24 hours
          </p>
        </div>
      </div>
    )
  }

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
        <h1 className="text-lg font-bold text-foreground">Report Issue</h1>
      </div>

      {/* Issue Selector */}
      <div>
        <p className="mb-3 text-sm text-muted-foreground">Select the issue you experienced</p>
        <div className="flex flex-col gap-2">
          {complaintIssues.map((issue) => {
            const Icon = iconMap[issue.icon]
            return (
              <GlassCard
                key={issue.id}
                onClick={() => setSelectedIssue(issue.id)}
                className={`flex items-center gap-3 py-3 ${
                  selectedIssue === issue.id ? "ring-2 ring-primary" : ""
                }`}
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    selectedIssue === issue.id ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span
                  className={`text-sm font-medium ${
                    selectedIssue === issue.id ? "text-primary" : "text-foreground"
                  }`}
                >
                  {issue.label}
                </span>
              </GlassCard>
            )
          })}
        </div>
      </div>

      {/* Additional Details */}
      {selectedIssue && (
        <div>
          <label htmlFor="details" className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Additional Details
          </label>
          <textarea
            id="details"
            rows={3}
            placeholder="Please describe the issue in detail..."
            className="w-full resize-none rounded-lg bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      )}

      {/* Submit */}
      <AnimatedButton
        variant="primary"
        size="lg"
        className="w-full"
        onClick={handleSubmit}
        disabled={!selectedIssue}
      >
        Submit Report
      </AnimatedButton>
    </div>
  )
}
