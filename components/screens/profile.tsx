"use client"

import { ArrowLeft, Car, CreditCard, Bell, ChevronRight, Zap, LogOut, Shield, HelpCircle } from "lucide-react"
import { GlassCard } from "@/components/smartcar/glass-card"
import { AnimatedCard } from "@/components/smartcar/animated-card"
import { useNavigation } from "@/lib/navigation-context"
import { userCar, subscriptionPlan } from "@/lib/mock-data"

export function ProfileScreen() {
  const { goBack, navigate } = useNavigation()

  const menuSections = [
    {
      title: "Vehicle",
      items: [
        {
          icon: <Car className="h-4 w-4" />,
          label: "My Vehicles",
          value: "1 vehicle",
          action: () => navigate("add-car"),
        },
        {
          icon: <Zap className="h-4 w-4" />,
          label: "Subscription",
          value: subscriptionPlan.name,
          action: () => navigate("subscription"),
        },
      ],
    },
    {
      title: "Account",
      items: [
        {
          icon: <CreditCard className="h-4 w-4" />,
          label: "Payment Methods",
          value: "Visa ****4829",
          action: () => {},
        },
        {
          icon: <Bell className="h-4 w-4" />,
          label: "Notifications",
          value: "Enabled",
          action: () => {},
        },
        {
          icon: <Shield className="h-4 w-4" />,
          label: "Complaints",
          value: "",
          action: () => navigate("complaint"),
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          icon: <HelpCircle className="h-4 w-4" />,
          label: "Help Center",
          value: "",
          action: () => {},
        },
        {
          icon: <LogOut className="h-4 w-4" />,
          label: "Sign Out",
          value: "",
          action: () => {},
        },
      ],
    },
  ]

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
        <h1 className="text-lg font-bold text-foreground">Profile</h1>
      </div>

      {/* User Card */}
      <GlassCard className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <span className="text-xl font-bold">AK</span>
        </div>
        <div className="flex-1">
          <p className="text-base font-bold text-foreground">Arjun Kapoor</p>
          <p className="text-xs text-muted-foreground">+91 98765 43210</p>
        </div>
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary uppercase">
          Premium
        </span>
      </GlassCard>

      {/* Current Vehicle Quick View */}
      <GlassCard className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
          <Car className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">{userCar.name}</p>
          <p className="text-xs font-mono text-muted-foreground">{userCar.number}</p>
        </div>
        <span className="text-xs text-muted-foreground">{userCar.parkingSlot}</span>
      </GlassCard>

      {/* Menu Sections */}
      {menuSections.map((section) => (
        <div key={section.title}>
          <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {section.title}
          </p>
          <div className="flex flex-col gap-1">
            {section.items.map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all hover:bg-secondary/50 active:scale-[0.98]"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                  {item.icon}
                </div>
                <span className="flex-1 text-left text-sm font-medium text-foreground">{item.label}</span>
                {item.value && (
                  <span className="text-xs text-muted-foreground">{item.value}</span>
                )}
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* App Version */}
      <p className="text-center text-xs text-muted-foreground/50">SmartCar Care v1.0.0</p>
    </div>
  )
}
