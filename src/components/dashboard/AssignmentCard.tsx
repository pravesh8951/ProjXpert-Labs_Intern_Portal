"use client";

import { motion } from "framer-motion";
import { Upload, Calendar, FileText, CheckCircle2, AlertCircle } from "lucide-react";

export default function AssignmentCard({ title, dueDate, status }: { title: string, dueDate: string, status: "pending" | "submitted" }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative p-6 rounded-2xl border transition-all ${status === "submitted"
        ? "bg-green-500/5 border-green-500/20"
        : "bg-white/[0.02] border-white/5 hover:border-white/10"
        }`}
    >
      <div className="flex justify-between items-start mb-5">
        <div className={`p-2.5 rounded-xl ${status === "submitted" ? "bg-green-500/10 border border-green-500/20" : "bg-purple-500/10 border border-purple-500/20"}`}>
          <FileText className={`w-5 h-5 ${status === "submitted" ? "text-green-400" : "text-purple-400"}`} />
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider border ${status === "submitted" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
          }`}>
          {status === "submitted" ? (
            <><CheckCircle2 className="w-3 h-3" /> Submitted</>
          ) : (
            <><AlertCircle className="w-3 h-3" /> Due Soon</>
          )}
        </div>
      </div>

      <h4 className="text-base font-extrabold text-white mb-2 leading-snug">{title}</h4>
      <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-5 font-medium">
        <Calendar className="w-3.5 h-3.5" />
        <span>Due: {dueDate}</span>
      </div>

      {status === "submitted" ? (
        <div className="flex items-center gap-2 text-green-400 font-bold text-xs bg-green-500/10 border border-green-500/20 p-3.5 rounded-xl">
          <CheckCircle2 className="w-4 h-4" /> Your work has been verified
        </div>
      ) : (
        <button className="group w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-purple-600/15">
          Submit Work <Upload className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}
    </motion.div>
  );
}
