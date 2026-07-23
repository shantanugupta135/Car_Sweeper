"use client"

import { useState } from "react"
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Maximize2,
  ZoomIn,
  Car,
  User,
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
  Camera,
  Star,
  Eye
} from "lucide-react"
import { DailyCleanJob } from "@/lib/types/api"

interface PhotoAuditModalProps {
  isOpen: boolean
  onClose: () => void
  job: DailyCleanJob | null
  onApprove?: (jobId: string) => void
  onFlag?: (jobId: string) => void
}

export function PhotoAuditModal({
  isOpen,
  onClose,
  job,
  onApprove,
  onFlag
}: PhotoAuditModalProps) {
  const [activeZoomUrl, setActiveZoomUrl] = useState<string | null>(null)
  const [zoomTitle, setZoomTitle] = useState<string>("")
  const [actionSuccess, setActionSuccess] = useState<"approved" | "flagged" | null>(null)

  if (!isOpen || !job) return null

  const beforePhoto =
    job.beforePhotoUrl ||
    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=80"
  const afterPhoto =
    job.afterPhotoUrl ||
    "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&auto=format&fit=crop&q=80"

  const handleApprove = () => {
    setActionSuccess("approved")
    if (onApprove) {
      onApprove(job.id)
    }
    setTimeout(() => {
      setActionSuccess(null)
      onClose()
    }, 1200)
  }

  const handleFlag = () => {
    setActionSuccess("flagged")
    if (onFlag) {
      onFlag(job.id)
    }
    setTimeout(() => {
      setActionSuccess(null)
      onClose()
    }, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Dark backdrop blur */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-[#0D0E11]/95 border border-[var(--glass-border)] rounded-2xl shadow-2xl overflow-hidden z-10 my-auto text-white">
        {/* Glow accent header line */}
        <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-amber-500" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-[var(--glass-border)] flex items-start justify-between bg-white/[0.02]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Camera className="w-3.5 h-3.5" />
                Wash Photo Quality Audit
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Job ID: #{job.id}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Photo Inspection & Quality Control
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Verify cleaner wash execution before issuing payout & customer confirmation.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success / Warning Overlay Alert */}
        {actionSuccess && (
          <div
            className={`p-4 text-center font-medium text-sm flex items-center justify-center gap-2 animate-fadeIn ${
              actionSuccess === "approved"
                ? "bg-emerald-500/20 text-emerald-300 border-b border-emerald-500/30"
                : "bg-rose-500/20 text-rose-300 border-b border-rose-500/30"
            }`}
          >
            {actionSuccess === "approved" ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Wash Approved! 5-Star quality rating recorded for cleaner.
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                Wash Flagged! Ticket created for immediate re-wash request.
              </>
            )}
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Job Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/[0.02] border border-white/5 rounded-xl p-4">
            {/* Vehicle */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Car className="w-3.5 h-3.5 text-cyan-400" />
                Vehicle Details
              </div>
              <p className="text-sm font-semibold text-white font-mono">
                {job.vehicleReg}
              </p>
              <p className="text-xs text-slate-300 truncate">
                {job.vehicleModel}
              </p>
            </div>

            {/* Owner & Cleaner */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <User className="w-3.5 h-3.5 text-amber-400" />
                Owner & Cleaner
              </div>
              <p className="text-sm font-semibold text-white truncate">
                {job.ownerName}
              </p>
              <p className="text-xs text-emerald-400 flex items-center gap-1 truncate">
                <ShieldCheck className="w-3 h-3 inline" />
                {job.cleanerName}
              </p>
            </div>

            {/* Location & Parking */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                Society & Bay
              </div>
              <p className="text-sm font-semibold text-white truncate">
                {job.societyName}
              </p>
              <p className="text-xs text-slate-300">
                {job.tower} • Bay <span className="font-mono">{job.parkingSpot}</span>
              </p>
            </div>

            {/* Completion Time & Status */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                Completion Time
              </div>
              <p className="text-sm font-semibold text-white font-mono">
                {job.completedAt || "In Progress"}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${
                    job.status === "completed"
                      ? "bg-emerald-400 animate-pulse"
                      : job.status === "in_progress"
                      ? "bg-cyan-400 animate-pulse"
                      : job.status === "skipped"
                      ? "bg-rose-400"
                      : "bg-amber-400"
                  }`}
                />
                <span className="text-xs capitalize text-slate-300 font-medium">
                  {job.status.replace("_", " ")}
                </span>
              </div>
            </div>
          </div>

          {/* Side-by-Side Photo Comparison */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-200 tracking-wide uppercase flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Side-by-Side Photo Comparison
              </h3>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                Click photo to expand / zoom
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Before Wash Card */}
              <div className="relative group bg-[#13151C] border border-amber-500/20 rounded-xl overflow-hidden shadow-lg transition-all hover:border-amber-500/40">
                <div className="p-3 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 tracking-wider uppercase flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    Before Wash Photo
                  </span>
                  <span className="text-[11px] text-amber-300/80 font-mono">
                    Captured at Start
                  </span>
                </div>

                <div
                  className="relative aspect-video bg-black/60 cursor-pointer overflow-hidden group-hover:opacity-95 transition-opacity"
                  onClick={() => {
                    setActiveZoomUrl(beforePhoto)
                    setZoomTitle(`Before Wash: ${job.vehicleReg} (${job.vehicleModel})`)
                  }}
                >
                  <img
                    src={beforePhoto}
                    alt="Before wash"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <span className="px-3 py-1.5 bg-black/70 backdrop-blur-md rounded-lg text-xs text-white font-medium flex items-center gap-1.5 border border-white/10">
                      <ZoomIn className="w-4 h-4 text-amber-400" />
                      Expand Photo
                    </span>
                  </div>
                </div>

                <div className="p-2.5 bg-black/40 text-center text-xs text-slate-400 border-t border-white/5">
                  Initial vehicle state before cleaning procedure
                </div>
              </div>

              {/* After Wash Card */}
              <div className="relative group bg-[#13151C] border border-emerald-500/20 rounded-xl overflow-hidden shadow-lg transition-all hover:border-emerald-500/40">
                <div className="p-3 bg-emerald-500/10 border-b border-emerald-500/20 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    After Wash Photo
                  </span>
                  <span className="text-[11px] text-emerald-300/80 font-mono">
                    {job.completedAt || "Completed"}
                  </span>
                </div>

                <div
                  className="relative aspect-video bg-black/60 cursor-pointer overflow-hidden group-hover:opacity-95 transition-opacity"
                  onClick={() => {
                    setActiveZoomUrl(afterPhoto)
                    setZoomTitle(`After Wash: ${job.vehicleReg} (${job.vehicleModel})`)
                  }}
                >
                  <img
                    src={afterPhoto}
                    alt="After wash"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <span className="px-3 py-1.5 bg-black/70 backdrop-blur-md rounded-lg text-xs text-white font-medium flex items-center gap-1.5 border border-white/10">
                      <ZoomIn className="w-4 h-4 text-emerald-400" />
                      Expand Photo
                    </span>
                  </div>
                </div>

                <div className="p-2.5 bg-black/40 text-center text-xs text-slate-400 border-t border-white/5">
                  Final cleaned vehicle state submitted by cleaner
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer / Action Buttons */}
        <div className="p-4 sm:p-6 border-t border-[var(--glass-border)] bg-black/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleFlag}
            disabled={actionSuccess !== null}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            Flag Issue / Request Re-wash
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 font-medium text-xs sm:text-sm transition-all"
            >
              Close
            </button>

            <button
              type="button"
              onClick={handleApprove}
              disabled={actionSuccess !== null}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4 text-white" />
              Approve Wash (5★ Quality)
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox Image Zoom Modal */}
      {activeZoomUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 animate-fadeIn"
          onClick={() => setActiveZoomUrl(null)}
        >
          <div className="absolute top-4 right-4 flex items-center gap-3 z-10">
            <span className="text-sm font-semibold text-white bg-black/60 px-3 py-1.5 rounded-lg border border-white/10">
              {zoomTitle}
            </span>
            <button
              onClick={() => setActiveZoomUrl(null)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div
            className="relative max-w-5xl max-h-[85vh] overflow-hidden rounded-2xl border border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeZoomUrl}
              alt="Zoomed view"
              className="w-full h-full object-contain max-h-[85vh]"
            />
          </div>
        </div>
      )}
    </div>
  )
}
