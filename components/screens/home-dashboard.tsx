"use client"

import { Car, Droplets, Clock, Shield, ChevronRight, Plus, Sparkles, Zap, TrendingUp, Award, Activity } from "lucide-react"
import { GlassCard } from "@/components/smartcar/glass-card"
import { StatusRing } from "@/components/smartcar/status-ring"
import { DashboardTile } from "@/components/smartcar/dashboard-tile"
import { AnimatedButton } from "@/components/smartcar/animated-button"
import { AnimatedCard } from "@/components/smartcar/animated-card"
import { AnimatedStat } from "@/components/smartcar/animated-stat"
import { AnimatedCounter } from "@/components/smartcar/animated-counter"
import { FloatingParticles } from "@/components/smartcar/floating-particles"
import { useNavigation } from "@/lib/navigation-context"
import { userCar, cleaningStatus, subscriptionPlan } from "@/lib/mock-data"
import Image from "next/image"

export function HomeDashboard() {
  const { navigate } = useNavigation()

  const statusLabels = {
    waiting: "Waiting",
    cleaning: "In Progress",
    completed: "Completed",
  }

  const statusColors = {
    waiting: "bg-amber-400/10 text-amber-400",
    cleaning: "bg-primary/10 text-primary",
    completed: "bg-emerald-400/10 text-emerald-400",
  }

  return (
    <div className="flex flex-col gap-6 px-4 pb-8 pt-6">
      {/* Floating particles background */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <FloatingParticles count={15} density="low" />
      </div>

      {/* Header with animation */}
      <div className="relative z-10 flex items-center justify-between animate-slide-in-top">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">SmartCar Care</p>
          <h1 className="text-3xl font-bold text-foreground text-balance">Welcome Back</h1>
        </div>
        <button
          onClick={() => navigate("profile")}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 text-primary font-bold transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/20 active:scale-95"
          aria-label="Profile"
        >
          <span className="text-sm font-bold">AK</span>
        </button>
      </div>

      {/* Car Status Hero Card */}
      <GlassCard
        className="relative overflow-hidden cursor-pointer animate-slide-in-bottom animation-delay-100 hover:shadow-lg hover:shadow-primary/20 transition-all"
        onClick={() => navigate("cleaning-status")}
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${statusColors[cleaningStatus.status]}`}
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
                </span>
                {statusLabels[cleaningStatus.status]}
              </span>
            </div>
            <h2 className="text-lg font-bold text-foreground">{userCar.name}</h2>
            <p className="text-xs text-muted-foreground font-mono">{userCar.number}</p>
          </div>

          <StatusRing
            progress={cleaningStatus.progress}
            size={100}
            strokeWidth={5}
            label={`${cleaningStatus.progress}%`}
            status={cleaningStatus.status}
          />
        </div>

        {/* Car Image */}
        <div className="relative mt-3 h-40 w-full overflow-hidden rounded-lg">
          <Image
            src={userCar.image}
            alt={`${userCar.name} vehicle`}
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary backdrop-blur-sm">
              <Sparkles className="h-3 w-3" />
              Health Score: {userCar.healthScore}%
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>Cleaner: {cleaningStatus.cleanerName}</span>
          <span className="flex items-center gap-1">
            ETA: {cleaningStatus.estimatedEnd}
            <ChevronRight className="h-3 w-3" />
          </span>
        </div>
      </GlassCard>

      {/* Quick Stats Grid with Animation */}
      <div className="grid grid-cols-2 gap-3">
        <AnimatedStat
          icon={<Clock className="h-5 w-5" />}
          label="Next Clean"
          value={7}
          prefix=""
          suffix=":15 AM"
          sublabel="Tomorrow"
          delay={200}
        />
        <AnimatedStat
          icon={<Award className="h-5 w-5" />}
          label="Rating"
          value={4}
          suffix=".8/5"
          sublabel="Avg. this month"
          variant="highlight"
          delay={300}
          onClick={() => navigate("history")}
        />
        <AnimatedStat
          icon={<Droplets className="h-5 w-5" />}
          label="This Month"
          value={22}
          suffix=" Washes"
          sublabel="3 missed"
          delay={400}
        />
        <AnimatedStat
          icon={<TrendingUp className="h-5 w-5" />}
          label="Streak"
          value={8}
          suffix=" days"
          sublabel="Keep it going!"
          variant="success"
          delay={500}
        />
      </div>

      {/* Service Timeline Preview */}
      <div className="animate-slide-in-bottom animation-delay-300">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            Recent Activity
          </h3>
          <button
            onClick={() => navigate("history")}
            className="text-xs text-primary transition-colors hover:text-primary/80 font-medium"
          >
            View All →
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {[
            { day: "Today", service: "Exterior Wash", time: "07:15 AM", status: "cleaning" as const },
            { day: "Yesterday", service: "Full Service", time: "07:25 AM", status: "completed" as const },
            { day: "Feb 23", service: "Exterior Wash", time: "07:40 AM", status: "completed" as const },
          ].map((item, i) => (
            <AnimatedCard
              key={i}
              className="flex items-center justify-between py-3 px-4 cursor-pointer"
              variant={item.status === "cleaning" ? "hover-glow" : "default"}
              delay={400 + i * 100}
            >
              <div className="flex items-center gap-3 flex-1">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg transition-transform hover:scale-110 ${
                    item.status === "cleaning"
                      ? "bg-primary/10 text-primary animate-pulse-ring"
                      : "bg-emerald-400/10 text-emerald-400"
                  }`}
                >
                  <Car className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{item.service}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.day} at {item.time}
                  </p>
                </div>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                  item.status === "cleaning"
                    ? "bg-primary/10 text-primary"
                    : "bg-emerald-400/10 text-emerald-400"
                }`}
              >
                {item.status === "cleaning" ? "In Progress" : "Done"}
              </span>
            </AnimatedCard>
          ))}
        </div>
      </div>

      {/* Quick Action FABs */}
      <div className="fixed bottom-6 right-4 flex flex-col gap-3">
        <button
          onClick={() => navigate("complaint")}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-muted-foreground shadow-lg transition-all hover:text-foreground active:scale-95"
          aria-label="Report issue"
        >
          <Shield className="h-5 w-5" />
        </button>
        <AnimatedButton
          variant="primary"
          className="flex h-14 w-14 items-center justify-center rounded-full p-0"
          onClick={() => navigate("add-car")}
        >
          <Plus className="h-6 w-6" />
        </AnimatedButton>
      </div>
    </div>
  )
}
