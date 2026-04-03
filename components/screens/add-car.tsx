"use client"

import { useState } from "react"
import { ArrowLeft, Car, Truck, Bike, Check } from "lucide-react"
import { GlassCard } from "@/components/smartcar/glass-card"
import { AnimatedButton } from "@/components/smartcar/animated-button"
import { ProgressIndicator } from "@/components/smartcar/progress-indicator"
import { useNavigation } from "@/lib/navigation-context"

const vehicleTypes = [
  { id: "sedan", label: "Sedan", icon: Car },
  { id: "suv", label: "SUV", icon: Truck },
  { id: "hatchback", label: "Hatch", icon: Car },
  { id: "bike", label: "Bike", icon: Bike },
]

const societies = [
  "Prestige Towers",
  "Royal Palms",
  "Green Valley Enclave",
  "Sunrise Heights",
  "Lake View Residency",
  "Palm Springs",
]

export function AddCarScreen() {
  const { goBack, navigate } = useNavigation()
  const [step, setStep] = useState(0)
  const [selectedType, setSelectedType] = useState("")
  const [carNumber, setCarNumber] = useState("")
  const [parkingSlot, setParkingSlot] = useState("")
  const [selectedSociety, setSelectedSociety] = useState("")

  const steps = [
    { label: "Type", completed: step > 0, active: step === 0 },
    { label: "Details", completed: step > 1, active: step === 1 },
    { label: "Location", completed: step > 2, active: step === 2 },
    { label: "Confirm", completed: step > 3, active: step === 3 },
  ]

  const canNext =
    (step === 0 && selectedType) ||
    (step === 1 && carNumber.length >= 4) ||
    (step === 2 && selectedSociety && parkingSlot) ||
    step === 3

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      navigate("home")
    }
  }

  return (
    <div className="flex flex-col gap-6 px-4 pb-8 pt-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={step > 0 ? () => setStep(step - 1) : goBack}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground transition-all active:scale-95"
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-foreground">Add Vehicle</h1>
        </div>
      </div>

      {/* Progress */}
      <ProgressIndicator steps={steps} className="justify-center" />

      {/* Step 0: Vehicle Type */}
      {step === 0 && (
        <div className="flex flex-col gap-4">
          <p className="text-center text-sm text-muted-foreground">Select your vehicle type</p>
          <div className="grid grid-cols-2 gap-3">
            {vehicleTypes.map((type) => (
              <GlassCard
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`flex flex-col items-center gap-3 py-8 ${
                  selectedType === type.id ? "ring-2 ring-primary" : ""
                }`}
              >
                <type.icon className={`h-10 w-10 ${selectedType === type.id ? "text-primary" : "text-muted-foreground"}`} />
                <span className={`text-sm font-medium ${selectedType === type.id ? "text-primary" : "text-foreground"}`}>
                  {type.label}
                </span>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* Step 1: Car Details */}
      {step === 1 && (
        <div className="flex flex-col gap-4">
          <p className="text-center text-sm text-muted-foreground">Enter vehicle details</p>
          <GlassCard className="flex flex-col gap-4">
            <div>
              <label htmlFor="car-number" className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Registration Number
              </label>
              <input
                id="car-number"
                value={carNumber}
                onChange={(e) => setCarNumber(e.target.value.toUpperCase())}
                placeholder="MH 02 AB 1234"
                className="w-full rounded-lg bg-secondary px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label htmlFor="car-name" className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Vehicle Name (Optional)
              </label>
              <input
                id="car-name"
                placeholder="My BMW 5 Series"
                className="w-full rounded-lg bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </GlassCard>
        </div>
      )}

      {/* Step 2: Location */}
      {step === 2 && (
        <div className="flex flex-col gap-4">
          <p className="text-center text-sm text-muted-foreground">Where is your vehicle parked?</p>
          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Society / Complex
            </label>
            <div className="flex flex-col gap-2">
              {societies.map((society) => (
                <GlassCard
                  key={society}
                  onClick={() => setSelectedSociety(society)}
                  className={`flex items-center justify-between py-3 ${
                    selectedSociety === society ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <span className={`text-sm ${selectedSociety === society ? "text-primary font-medium" : "text-foreground"}`}>
                    {society}
                  </span>
                  {selectedSociety === society && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </GlassCard>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="parking-slot" className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Parking Slot
            </label>
            <input
              id="parking-slot"
              value={parkingSlot}
              onChange={(e) => setParkingSlot(e.target.value.toUpperCase())}
              placeholder="B2-045"
              className="w-full rounded-lg bg-secondary px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && (
        <div className="flex flex-col items-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Check className="h-10 w-10 text-primary" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-foreground">Ready to Go</h2>
            <p className="mt-1 text-sm text-muted-foreground">Your vehicle will be added to your account</p>
          </div>
          <GlassCard className="w-full">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Type</span>
                <span className="text-sm font-medium text-foreground capitalize">{selectedType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Number</span>
                <span className="text-sm font-mono font-medium text-foreground">{carNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Society</span>
                <span className="text-sm font-medium text-foreground">{selectedSociety}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Parking</span>
                <span className="text-sm font-mono font-medium text-foreground">{parkingSlot}</span>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Next Button */}
      <AnimatedButton
        variant="primary"
        size="lg"
        className="w-full"
        onClick={handleNext}
        disabled={!canNext}
      >
        {step === 3 ? "Add Vehicle" : "Continue"}
      </AnimatedButton>
    </div>
  )
}
