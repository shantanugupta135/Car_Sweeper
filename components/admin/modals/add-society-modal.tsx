"use client"

import { useState } from "react"
import { X, Sparkles, Building, MapPin, Navigation, Layers } from "lucide-react"
import { adminService } from "@/lib/services/admin-service"
import { Society } from "@/lib/types/api"

interface AddSocietyModalProps {
  isOpen: boolean
  onClose: () => void
  onSocietyAdded: (society: Society) => void
}

export function AddSocietyModal({ isOpen, onClose, onSocietyAdded }: AddSocietyModalProps) {
  // Form State
  const [name, setName] = useState("")
  const [city, setCity] = useState("")
  const [area, setArea] = useState("")
  const [towersInput, setTowersInput] = useState("")

  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")

    if (!name.trim()) {
      setErrorMsg("Society Name is required")
      return
    }
    if (!city.trim()) {
      setErrorMsg("City is required")
      return
    }
    if (!area.trim()) {
      setErrorMsg("Area / Locality is required")
      return
    }
    if (!towersInput.trim()) {
      setErrorMsg("Please enter at least one tower or block")
      return
    }

    const towersArray = towersInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0)

    if (towersArray.length === 0) {
      setErrorMsg("Please enter valid tower names separated by commas")
      return
    }

    try {
      setIsSubmitting(true)
      const newSociety = await adminService.addSociety({
        name: name.trim(),
        city: city.trim(),
        area: area.trim(),
        towers: towersArray,
      })

      onSocietyAdded(newSociety)
      resetForm()
      onClose()
    } catch (err) {
      setErrorMsg("Failed to add society. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setName("")
    setCity("")
    setArea("")
    setTowersInput("")
    setErrorMsg("")
  }

  // Live preview of parsed towers
  const parsedTowers = towersInput
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t.length > 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0B0F12] border border-[#1E2C21] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E2C21] bg-[#121914]/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#2E9E44]/20 border border-[#2E9E44]/40 text-[#7ED37F]">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#E2F0E4]">Onboard New Society</h2>
              <p className="text-xs text-[#7C8C7E]">Register an apartment complex for daily car sweeping service</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7C8C7E] hover:text-white hover:bg-[#1E2C21] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/50 text-red-300 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Society Name */}
          <div>
            <label className="block text-xs font-medium text-[#A3B8A5] mb-1.5 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-[#2E9E44]" /> Society / Residency Name
            </label>
            <input
              type="text"
              placeholder="e.g. Green Acres Residency"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl bg-[#141B15] border border-[#1E2C21] text-xs text-[#E2F0E4] placeholder-[#536355] focus:outline-none focus:border-[#2E9E44] focus:ring-1 focus:ring-[#2E9E44] transition-all"
            />
          </div>

          {/* City & Area Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#A3B8A5] mb-1.5 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-[#2E9E44]" /> City
              </label>
              <input
                type="text"
                placeholder="e.g. Mumbai"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-[#141B15] border border-[#1E2C21] text-xs text-[#E2F0E4] placeholder-[#536355] focus:outline-none focus:border-[#2E9E44] focus:ring-1 focus:ring-[#2E9E44] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#A3B8A5] mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#2E9E44]" /> Area / Locality
              </label>
              <input
                type="text"
                placeholder="e.g. Andheri West"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-[#141B15] border border-[#1E2C21] text-xs text-[#E2F0E4] placeholder-[#536355] focus:outline-none focus:border-[#2E9E44] focus:ring-1 focus:ring-[#2E9E44] transition-all"
              />
            </div>
          </div>

          {/* Towers Input */}
          <div>
            <label className="block text-xs font-medium text-[#A3B8A5] mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#2E9E44]" /> Towers / Blocks (Comma Separated)
              </span>
              <span className="text-[10px] text-[#7C8C7E]">e.g. Tower A, Tower B, Block 1</span>
            </label>
            <textarea
              rows={3}
              placeholder="Tower A, Tower B, Tower C"
              value={towersInput}
              onChange={(e) => setTowersInput(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#141B15] border border-[#1E2C21] text-xs text-[#E2F0E4] placeholder-[#536355] focus:outline-none focus:border-[#2E9E44] focus:ring-1 focus:ring-[#2E9E44] transition-all resize-none"
            />
          </div>

          {/* Parsed Towers Preview */}
          {parsedTowers.length > 0 && (
            <div className="p-3.5 rounded-xl bg-[#141B15] border border-[#1E2C21] space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#7C8C7E] font-medium">Parsed Towers Preview:</span>
                <span className="text-[#7ED37F] font-bold">{parsedTowers.length} tower(s)</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {parsedTowers.map((tower, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 rounded-lg bg-[#1E2C21] border border-[#2E9E44]/40 text-[#7ED37F] text-xs font-mono"
                  >
                    {tower}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#7C8C7E] hover:text-white hover:bg-[#1E2C21] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2E9E44] to-[#166534] hover:from-[#35b54e] hover:to-[#1e7e40] text-white text-xs font-bold shadow-lg shadow-[#2E9E44]/20 border border-[#7ED37F]/30 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isSubmitting ? "Onboarding Society..." : "Onboard Society"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
