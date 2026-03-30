"use client"

import { useState } from "react"
import { ArrowLeft, Star } from "lucide-react"
import { GlassCard } from "@/components/smartcar/glass-card"
import { AnimatedButton } from "@/components/smartcar/animated-button"
import { useNavigation } from "@/lib/navigation-context"
import { cleaningStatus } from "@/lib/mock-data"

const feedbackOptions = [
  "Thorough cleaning",
  "On time",
  "Polite & professional",
  "Great attention to detail",
  "Left the area clean",
  "Gentle with vehicle",
]

export function RatingScreen() {
  const { goBack, navigate } = useNavigation()
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [selectedFeedback, setSelectedFeedback] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)

  const toggleFeedback = (fb: string) => {
    setSelectedFeedback((prev) =>
      prev.includes(fb) ? prev.filter((f) => f !== fb) : [...prev, fb]
    )
  }

  const handleSubmit = () => {
    setSubmitted(true)
    setTimeout(() => navigate("home"), 2000)
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
        <div className="relative">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 animate-pulse-glow">
            <Star className="h-12 w-12 fill-primary text-primary" />
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Thank You!</h2>
          <p className="mt-2 text-sm text-muted-foreground">Your feedback helps us improve service quality</p>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} className="h-6 w-6 fill-amber-400 text-amber-400 animate-float" style={{ animationDelay: `${i * 100}ms` }} />
          ))}
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
        <h1 className="text-lg font-bold text-foreground">Rate Service</h1>
      </div>

      {/* Cleaner Info */}
      <GlassCard className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <span className="text-lg font-bold">
            {cleaningStatus.cleanerName.split(" ").map((n) => n[0]).join("")}
          </span>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{cleaningStatus.cleanerName}</p>
          <p className="text-xs text-muted-foreground">Today's service</p>
        </div>
      </GlassCard>

      {/* Star Rating */}
      <div className="flex flex-col items-center gap-4">
        <p className="text-sm text-muted-foreground">How was your experience?</p>
        <div className="flex gap-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="transition-all duration-200 active:scale-90"
              aria-label={`Rate ${star} stars`}
            >
              <Star
                className={`h-10 w-10 transition-all duration-200 ${
                  star <= (hoveredRating || rating)
                    ? "fill-amber-400 text-amber-400 scale-110"
                    : "text-secondary hover:text-muted-foreground"
                }`}
              />
            </button>
          ))}
        </div>
        {rating > 0 && (
          <p className="text-sm font-medium text-foreground">
            {rating === 5 ? "Excellent!" : rating === 4 ? "Great!" : rating === 3 ? "Good" : rating === 2 ? "Fair" : "Poor"}
          </p>
        )}
      </div>

      {/* Quick Feedback Tags */}
      {rating > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-foreground">What went well?</p>
          <div className="flex flex-wrap gap-2">
            {feedbackOptions.map((fb) => (
              <button
                key={fb}
                onClick={() => toggleFeedback(fb)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all active:scale-95 ${
                  selectedFeedback.includes(fb)
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {fb}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Comment */}
      {rating > 0 && (
        <div>
          <label htmlFor="comment" className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Additional Comments
          </label>
          <textarea
            id="comment"
            rows={3}
            placeholder="Tell us more about your experience..."
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
        disabled={rating === 0}
      >
        Submit Rating
      </AnimatedButton>
    </div>
  )
}
