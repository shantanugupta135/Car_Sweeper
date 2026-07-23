"use client"

import { ArrowLeft, Phone, MessageSquare, Star, Camera } from "lucide-react"
import { GlassCard } from "@/components/smartcar/glass-card"
import { StatusRing } from "@/components/smartcar/status-ring"
import { AnimatedButton } from "@/components/smartcar/animated-button"
import { useNavigation } from "@/lib/navigation-context"
import { cleaningStatus, userCar } from "@/lib/mock-data"

export function CleaningStatusScreen() {
  const { goBack, navigate } = useNavigation()

  const steps = [
    { label: "Assigned", time: "07:10 AM", done: true },
    { label: "Arrived", time: "07:15 AM", done: true },
    { label: "Cleaning", time: "07:18 AM", done: true },
    { label: "Finishing", time: "~07:40 AM", done: false },
    { label: "Completed", time: "~07:45 AM", done: false },
  ]

  return (
    <div className="flex flex-col gap-6 px-4 pb-8 pt-6 relative">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent animate-gradient-flow" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center gap-3 animate-slide-in-top">
        <button
          onClick={goBack}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground transition-all active:scale-95 hover:border hover:border-primary/30"
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-foreground">Live Status</h1>
          <p className="text-xs text-muted-foreground">{userCar.name} - {userCar.number}</p>
        </div>
      </div>

      {/* Main Progress Ring */}
      <div className="relative z-10 flex flex-col items-center gap-4 animate-slide-in-bottom animation-delay-100">
        <StatusRing
          progress={cleaningStatus.progress}
          size={180}
          strokeWidth={8}
          label={`${cleaningStatus.progress}%`}
          sublabel="Cleaning"
          status={cleaningStatus.status}
        />
        <p className="text-sm text-muted-foreground animate-pulse-glow">
          Estimated completion: <span className="font-medium text-foreground text-primary">{cleaningStatus.estimatedEnd}</span>
        </p>
      </div>

      {/* Cleaner Card */}
      <GlassCard className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <span className="text-lg font-bold">
            {cleaningStatus.cleanerName.split(" ").map((n) => n[0]).join("")}
          </span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">{cleaningStatus.cleanerName}</p>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="text-xs text-muted-foreground">{cleaningStatus.cleanerRating} rating</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-all hover:text-foreground active:scale-95"
            aria-label="Call cleaner"
          >
            <Phone className="h-4 w-4" />
          </button>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-all hover:text-foreground active:scale-95"
            aria-label="Message cleaner"
          >
            <MessageSquare className="h-4 w-4" />
          </button>
        </div>
      </GlassCard>

      {/* Service Steps Timeline */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Progress Timeline</h3>
        <div className="flex flex-col gap-0">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    step.done
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {step.done ? (
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-current" />
                  )}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`h-8 w-0.5 ${step.done ? "bg-primary" : "bg-secondary"}`}
                  />
                )}
              </div>
              <div className="pb-6">
                <p className={`text-sm font-medium ${step.done ? "text-foreground" : "text-muted-foreground"}`}>
                  {step.label}
                </p>
                <p className="text-xs text-muted-foreground">{step.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Services Being Performed */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Services Today</h3>
        <div className="flex flex-wrap gap-2">
          {cleaningStatus.services.map((service, i) => (
            <span
              key={i}
              className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary"
            >
              {service}
            </span>
          ))}
        </div>
      </div>

      {/* Before/After Photos */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Photos</h3>
        <div className="grid grid-cols-2 gap-3">
          <GlassCard className="flex flex-col items-center gap-2 py-8">
            <Camera className="h-6 w-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Before</span>
            <span className="text-[10px] text-muted-foreground/60">Photo available soon</span>
          </GlassCard>
          <GlassCard className="flex flex-col items-center gap-2 py-8">
            <Camera className="h-6 w-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">After</span>
            <span className="text-[10px] text-muted-foreground/60">In progress</span>
          </GlassCard>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <AnimatedButton
          variant="secondary"
          className="flex-1"
          onClick={() => navigate("complaint")}
        >
          Report Issue
        </AnimatedButton>
        <AnimatedButton
          variant="primary"
          className="flex-1"
          onClick={() => navigate("rating")}
        >
          Rate Service
        </AnimatedButton>
      </div>
    </div>
  )
}
