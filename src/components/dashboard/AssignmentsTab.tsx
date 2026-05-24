"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, FileText, CheckCircle2, Lock, Clock, AlertTriangle,
  Download, ExternalLink, Loader2, Shield, Brain, X,
  CalendarClock, TrendingUp, Award, FileUp, ChevronRight
} from "lucide-react";

interface AssignmentData {
  week: number;
  title: string;
  task: string;
  requiredDays: string;
  status: "locked" | "unlocked" | "submitted" | "deadline_passed";
  deadline: string;
  daysRemaining: number | null;
  submission: {
    fileName: string;
    fileSize: number;
    submittedAt: string;
    driveLink: string;
    adminStatus: string;
    adminRemarks: string;
  } | null;
}

const STATUS_CONFIG = {
  locked: {
    color: "gray",
    bg: "bg-white/[0.02]",
    border: "border-white/5",
    badge: "bg-white/5 text-gray-500 border-white/5",
    icon: Lock,
    label: "Locked",
  },
  unlocked: {
    color: "purple",
    bg: "bg-purple-500/[0.03]",
    border: "border-purple-500/20",
    badge: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    icon: Upload,
    label: "Ready to Submit",
  },
  submitted: {
    color: "green",
    bg: "bg-green-500/[0.03]",
    border: "border-green-500/20",
    badge: "bg-green-500/10 text-green-400 border-green-500/20",
    icon: CheckCircle2,
    label: "Submitted",
  },
  deadline_passed: {
    color: "red",
    bg: "bg-red-500/[0.03]",
    border: "border-red-500/15",
    badge: "bg-red-500/10 text-red-400 border-red-500/20",
    icon: AlertTriangle,
    label: "Submission Closed",
  },
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function DeadlineCountdown({ deadline, daysRemaining }: { deadline: string; daysRemaining: number | null }) {
  if (daysRemaining === null || daysRemaining === undefined) return null;
  const urgent = daysRemaining <= 3;
  return (
    <div className={`flex items-center gap-1.5 text-xs font-bold ${urgent ? "text-red-400" : "text-amber-400"}`}>
      <CalendarClock className="w-3.5 h-3.5" />
      <span>
        {daysRemaining === 0
          ? "Due Today!"
          : daysRemaining === 1
          ? "1 Day Remaining"
          : `${daysRemaining} Days Remaining`}
      </span>
    </div>
  );
}

function AdminStatusBadge({ status, remarks }: { status: string; remarks: string }) {
  if (!status || status === "submitted") return null;
  const config: Record<string, { bg: string; text: string; label: string }> = {
    reviewed: { bg: "bg-blue-500/10", text: "text-blue-400", label: "Reviewed" },
    approved: { bg: "bg-green-500/10", text: "text-green-400", label: "Approved ✓" },
    needs_changes: { bg: "bg-orange-500/10", text: "text-orange-400", label: "Needs Changes" },
  };
  const c = config[status] || config.reviewed;
  return (
    <div className="mt-3 space-y-1.5">
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${c.bg} ${c.text}`}>
        {c.label}
      </span>
      {remarks && (
        <p className="text-xs text-gray-400 italic pl-1">"{remarks}"</p>
      )}
    </div>
  );
}

export default function AssignmentsTab({ user, domain }: { user: any; domain: string }) {
  const [assignments, setAssignments] = useState<AssignmentData[]>([]);
  const [stats, setStats] = useState({ total: 12, submitted: 0, pending: 12 });
  const [loading, setLoading] = useState(true);
  const [uploadingWeek, setUploadingWeek] = useState<number | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [successWeek, setSuccessWeek] = useState<number | null>(null);
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const fetchAssignments = async () => {
    try {
      const res = await fetch("/api/assignments", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load assignments");
      const data = await res.json();
      setAssignments(data.assignments || []);
      setStats(data.stats || { total: 12, submitted: 0, pending: 12 });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleUpload = async (week: number, file: File) => {
    setUploadingWeek(week);
    setUploadProgress(0);
    setError(null);

    // Validate on client side too
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    const allowed = [".pdf", ".doc", ".docx", ".ppt", ".pptx", ".zip"];
    if (!allowed.includes(ext)) {
      setError(`Invalid file type. Allowed: ${allowed.join(", ")}`);
      setUploadingWeek(null);
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setError("File size exceeds 15 MB limit.");
      setUploadingWeek(null);
      return;
    }

    // Simulate progress (actual upload doesn't have progress events with fetch)
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => Math.min(prev + 8, 85));
    }, 200);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("assignmentWeek", String(week));

      const res = await fetch("/api/assignments/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      setUploadProgress(100);
      setSuccessWeek(week);

      // Refresh assignments
      setTimeout(() => {
        fetchAssignments();
        setUploadingWeek(null);
        setUploadProgress(0);
        setTimeout(() => setSuccessWeek(null), 3000);
      }, 800);
    } catch (err: any) {
      clearInterval(progressInterval);
      setError(err.message);
      setUploadingWeek(null);
      setUploadProgress(0);
    }
  };

  const handleDrop = (week: number, e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(week, file);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
        <p className="text-gray-500 text-sm font-medium">Loading assignments…</p>
      </div>
    );
  }

  const DomainIcon = domain === "ai" ? Brain : Shield;
  const domainColor = domain === "ai" ? "blue" : "purple";

  return (
    <div className="space-y-8 pb-20">
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl bg-${domainColor}-500/10 border border-${domainColor}-500/20`}>
            <FileText className={`w-6 h-6 text-${domainColor}-400`} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Project Assignments</h2>
            <p className="text-gray-500 text-sm font-medium mt-0.5">
              Complete 5 days of study to unlock each assignment
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="flex gap-3">
          {[
            { label: "Submitted", value: stats.submitted, color: "text-green-400", bg: "bg-green-500/10" },
            { label: "Pending", value: stats.pending, color: "text-amber-400", bg: "bg-amber-500/10" },
            { label: "Total", value: stats.total, color: "text-white", bg: "bg-white/5" },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} border border-white/5 rounded-xl px-4 py-2.5 text-center min-w-[80px]`}>
              <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── OVERALL PROGRESS BAR ── */}
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5" /> Overall Progress
          </span>
          <span className="text-sm font-black text-white">{stats.submitted}/12</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(stats.submitted / 12) * 100}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
          />
        </div>
      </div>

      {/* ── ERROR TOAST ── */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <p className="text-sm text-red-300 font-medium">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SUCCESS TOAST ── */}
      <AnimatePresence>
        {successWeek !== null && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <p className="text-sm text-green-300 font-medium">
              Assignment {successWeek} submitted successfully!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── ASSIGNMENT CARDS GRID ── */}
      <div className="grid md:grid-cols-2 gap-6">
        {assignments.map((assignment, i) => {
          const config = STATUS_CONFIG[assignment.status];
          const StatusIcon = config.icon;
          const isUploading = uploadingWeek === assignment.week;

          return (
            <motion.div
              key={assignment.week}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`relative rounded-2xl border p-6 transition-all ${config.bg} ${config.border} ${
                assignment.status === "locked" ? "opacity-50" : ""
              } ${
                assignment.status === "unlocked"
                  ? "shadow-[0_0_30px_rgba(168,85,247,0.05)] hover:shadow-[0_0_40px_rgba(168,85,247,0.1)] hover:border-purple-500/30"
                  : ""
              }`}
            >
              {/* Top row: Week badge + Status badge */}
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.15em] px-2.5 py-1 bg-white/5 rounded-lg text-gray-400 border border-white/5">
                  Week {assignment.week}
                </span>
                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${config.badge}`}>
                  <StatusIcon className="w-3 h-3" />
                  {config.label}
                </span>
              </div>

              {/* Title */}
              <h3 className={`text-lg font-bold mb-2 leading-snug ${
                assignment.status === "locked" ? "text-gray-500" : "text-white"
              }`}>
                {assignment.title}
              </h3>

              {/* Task Description */}
              <p className={`text-sm mb-4 leading-relaxed ${
                assignment.status === "locked" ? "text-gray-600" : "text-gray-400"
              }`}>
                {assignment.task}
              </p>

              {/* Required Days */}
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-4">
                <Clock className="w-3 h-3" />
                Requires: {assignment.requiredDays}
              </div>

              {/* ── LOCKED STATE ── */}
              {assignment.status === "locked" && (
                <div className="flex items-center gap-2 text-gray-500 text-xs font-medium bg-white/[0.02] border border-white/5 p-3.5 rounded-xl">
                  <Lock className="w-4 h-4" />
                  Complete {assignment.requiredDays} to unlock this assignment
                </div>
              )}

              {/* ── UNLOCKED STATE — Upload Area ── */}
              {assignment.status === "unlocked" && (
                <div className="space-y-3">
                  <DeadlineCountdown deadline={assignment.deadline} daysRemaining={assignment.daysRemaining} />

                  {isUploading ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-purple-400 text-sm font-medium">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Uploading…
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          animate={{ width: `${uploadProgress}%` }}
                          className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div
                      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      onDrop={(e) => handleDrop(assignment.week, e)}
                      onClick={() => fileInputRefs.current[assignment.week]?.click()}
                      className="group cursor-pointer border-2 border-dashed border-purple-500/20 hover:border-purple-500/40 rounded-xl p-6 text-center transition-all hover:bg-purple-500/[0.03]"
                    >
                      <FileUp className="w-8 h-8 text-purple-400/60 mx-auto mb-2 group-hover:text-purple-400 transition-colors group-hover:-translate-y-0.5 transition-transform" />
                      <p className="text-sm font-bold text-gray-400 group-hover:text-gray-300 transition-colors">
                        Drop file here or click to browse
                      </p>
                      <p className="text-[10px] text-gray-600 mt-1 uppercase tracking-wider font-bold">
                        PDF, DOC, DOCX, PPT, PPTX, ZIP — Max 15 MB
                      </p>
                      <input
                        ref={(el) => { fileInputRefs.current[assignment.week] = el; }}
                        type="file"
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUpload(assignment.week, file);
                          e.target.value = "";
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* ── SUBMITTED STATE ── */}
              {assignment.status === "submitted" && assignment.submission && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 bg-green-500/[0.05] border border-green-500/15 p-3.5 rounded-xl">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <FileText className="w-4 h-4 text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">
                        {assignment.submission.fileName}
                      </p>
                      <p className="text-[10px] text-gray-500 font-medium">
                        {formatFileSize(assignment.submission.fileSize)} • {new Date(assignment.submission.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <a
                      href={assignment.submission.driveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-all"
                      title="View on Google Drive"
                    >
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </a>
                  </div>

                  <AdminStatusBadge
                    status={assignment.submission.adminStatus}
                    remarks={assignment.submission.adminRemarks}
                  />
                </div>
              )}

              {/* ── DEADLINE PASSED STATE ── */}
              {assignment.status === "deadline_passed" && (
                <div className="flex items-center gap-2 text-red-400 text-xs font-medium bg-red-500/[0.05] border border-red-500/15 p-3.5 rounded-xl">
                  <AlertTriangle className="w-4 h-4" />
                  Submission window has closed
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
