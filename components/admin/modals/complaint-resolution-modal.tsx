"use client"

import { useState } from "react"
import { Complaint } from "@/lib/types/api"
import {
  X,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RotateCcw,
  CreditCard,
  Check,
  User,
  Car,
  ShieldCheck,
  Camera,
  MessageSquare,
  Sparkles,
  ExternalLink
} from "lucide-react"

interface ComplaintResolutionModalProps {
  isOpen: boolean
  onClose: () => void
  complaint: Complaint | null
  onResolveAction: (
    complaintId: string,
    action: "rewash" | "credit" | "resolve",
    newStatus: Complaint["status"]
  ) => void
}

export function ComplaintResolutionModal({
  isOpen,
  onClose,
  complaint,
  onResolveAction
}: ComplaintResolutionModalProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)

  if (!isOpen || !complaint) return null

  // Issue Type display helper
  const getIssueBadge = (type: Complaint["issueType"]) => {
    switch (type) {
      case "missed_wash":
        return { label: "Missed Wash", color: "bg-amber-500/10 text-amber-400 border-amber-500/30" }
      case "poor_quality":
        return { label: "Poor Quality", color: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30" }
      case "scratch_or_damage":
        return { label: "Scratch / Damage", color: "bg-rose-500/10 text-rose-400 border-rose-500/30" }
      case "other":
      default:
        return { label: "Other", color: "bg-slate-500/10 text-slate-300 border-slate-500/30" }
    }
  }

  const issueInfo = getIssueBadge(complaint.issueType)

  return (
    <div className="fixed inset-[0] z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-2xl bg-[var(--surface)] border border-[var(--glass-border)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-white animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-400">
                  TICKET #{complaint.id.toUpperCase()}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${issueInfo.color}`}
                >
                  {issueInfo.label}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">
                Complaint Details & Resolution Desk
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content Scrollable */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* Status Indicator Bar */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Current Status:</span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                  complaint.status === "resolved"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : complaint.status === "in_review"
                    ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/30"
                    : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    complaint.status === "resolved"
                      ? "bg-emerald-400"
                      : complaint.status === "in_review"
                      ? "bg-cyan-400 animate-pulse"
                      : "bg-rose-400"
                  }`}
                />
                <span className="capitalize">{complaint.status.replace("_", " ")}</span>
              </span>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Logged: {complaint.createdAt}
            </div>
          </div>

          {/* Customer & Cleaner Context Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <div className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                Customer
              </div>
              <p className="font-semibold text-white truncate">{complaint.consumerName}</p>
              <p className="text-[11px] text-slate-400 font-mono">ID: #{complaint.consumerId}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <div className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <Car className="w-3.5 h-3.5 text-emerald-400" />
                Vehicle Reg
              </div>
              <p className="font-mono font-bold text-white">{complaint.vehicleReg}</p>
              <p className="text-[11px] text-slate-400 font-mono">Job: #{complaint.jobId}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <div className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Assigned Cleaner
              </div>
              <p className="font-semibold text-slate-200">{complaint.cleanerName}</p>
              <p className="text-[11px] text-slate-400">On-site Executive</p>
            </div>
          </div>

          {/* Customer Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              Customer Issue Description
            </h4>
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-slate-200 leading-relaxed font-sans">
              "{complaint.description}"
            </div>
          </div>

          {/* Photo Evidence Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-emerald-400" />
                Photo Evidence ({complaint.photoUrls.length})
              </h4>
              <span className="text-[11px] text-slate-500">Click to expand</span>
            </div>

            {complaint.photoUrls.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {complaint.photoUrls.map((url, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedPhoto(url)}
                    className="relative group rounded-xl overflow-hidden border border-white/10 cursor-pointer bg-black aspect-video hover:border-cyan-500/50 transition-all"
                  >
                    <img
                      src={url}
                      alt={`Evidence ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ExternalLink className="w-5 h-5 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-slate-500 text-center text-xs">
                No photo evidence attached to this complaint ticket.
              </div>
            )}
          </div>

          {/* Expanded Lightbox Image Preview if selected */}
          {selectedPhoto && (
            <div className="p-3 rounded-xl bg-black/80 border border-cyan-500/30 space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between text-xs text-cyan-300 font-medium">
                <span>Expanded Photo View</span>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="text-slate-400 hover:text-white"
                >
                  Close Zoom
                </button>
              </div>
              <img
                src={selectedPhoto}
                alt="Expanded evidence"
                className="w-full max-h-64 object-contain rounded-lg border border-white/10"
              />
            </div>
          )}

          {/* Resolution Actions Section */}
          <div className="space-y-3 pt-2 border-t border-white/10">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Select Resolution Action
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Option 1: Trigger Free Re-wash */}
              <button
                onClick={() => onResolveAction(complaint.id, "rewash", "in_review")}
                className="p-3.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-500/60 text-left transition-all group space-y-1.5"
              >
                <div className="flex items-center justify-between text-cyan-300">
                  <span className="font-bold text-xs">Trigger Free Re-wash</span>
                  <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                </div>
                <p className="text-[11px] text-cyan-200/70 leading-snug">
                  Dispatch complimentary re-clean task to cleaner.
                </p>
              </button>

              {/* Option 2: Issue Wallet Credit */}
              <button
                onClick={() => onResolveAction(complaint.id, "credit", "resolved")}
                className="p-3.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-500/60 text-left transition-all group space-y-1.5"
              >
                <div className="flex items-center justify-between text-amber-300">
                  <span className="font-bold text-xs">Issue Wallet Credit</span>
                  <CreditCard className="w-4 h-4" />
                </div>
                <p className="text-[11px] text-amber-200/70 leading-snug">
                  Credit ₹150 instantly to customer's wallet balance.
                </p>
              </button>

              {/* Option 3: Mark Resolved */}
              <button
                onClick={() => onResolveAction(complaint.id, "resolve", "resolved")}
                className="p-3.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/60 text-left transition-all group space-y-1.5"
              >
                <div className="flex items-center justify-between text-emerald-300">
                  <span className="font-bold text-xs">Mark Resolved</span>
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <p className="text-[11px] text-emerald-200/70 leading-snug">
                  Close ticket with confirmed resolution.
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  )
}
