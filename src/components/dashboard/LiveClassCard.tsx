"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Video, PlayCircle, ExternalLink, Users, Radio } from "lucide-react";

export default function LiveClassCard() {
  const [status, setStatus] = useState<"waiting" | "live" | "recorded">("waiting");
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateStatus = () => {
      const now = new Date();
      const istTime = new Date(now.getTime() + (now.getTimezoneOffset() + 330) * 60000);

      const start = new Date(istTime);
      start.setHours(19, 30, 0, 0);
      const end = new Date(istTime);
      end.setHours(20, 0, 0, 0);

      if (istTime >= start && istTime <= end) {
        setStatus("live");
      } else if (istTime > end) {
        setStatus("recorded");
      } else {
        setStatus("waiting");
        const diff = start.getTime() - istTime.getTime();
        const h = Math.floor(diff / 3600000).toString().padStart(2, "0");
        const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, "0");
        const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, "0");
        setTimeLeft(`${h}:${m}:${s}`);
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="card card-hover overflow-hidden bg-[#0d0f22]/90 border border-white/5"
    >
      {/* Header strip */}
      <div className={`px-5 py-3 flex items-center justify-between ${
        status === "live" ? "bg-red-950/20 border-b border-red-900/30" : "bg-white/[0.02] border-b border-white/5"
      }`}>
        <div className="flex items-center gap-2">
          {status === "live" ? (
            <>
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Live Now</span>
            </>
          ) : (
            <>
              <Radio className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Live Class</span>
            </>
          )}
        </div>
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Daily · 7:30 PM IST</span>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
            status === "live" ? "bg-red-500/10 border border-red-500/20" : "bg-blue-500/10 border border-blue-500/20"
          }`}>
            {status === "live" ? (
              <Video className="w-5 h-5 text-red-400" />
            ) : status === "recorded" ? (
              <PlayCircle className="w-5 h-5 text-blue-400" />
            ) : (
              <Clock className="w-5 h-5 text-blue-400" />
            )}
          </div>
          <div>
            <h3 className="text-white font-extrabold text-sm leading-snug">
              {status === "live" ? "Class is in Progress!" : status === "recorded" ? "Today's Class" : "Next Live Masterclass"}
            </h3>
            <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">Advanced Cybersecurity Concepts · Live Q&A</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-[10px] font-black">R</div>
          <span className="text-xs text-gray-300 font-semibold">Instructor Rahul Sharma</span>
        </div>

        <AnimatePresence mode="wait">
          {status === "waiting" && (
            <motion.div key="waiting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              <div className="flex items-center justify-between bg-white/[0.02] border border-white/5 rounded-xl p-4">
                <div>
                  <p className="text-[9px] text-gray-500 uppercase font-bold tracking-wider mb-1">Starts in</p>
                  <p className="text-2xl font-black text-white font-mono tracking-wider">{timeLeft}</p>
                </div>
                <Clock className="w-6 h-6 text-gray-600" />
              </div>
              <button disabled className="w-full py-3 bg-white/5 text-gray-500 text-xs font-bold rounded-lg cursor-not-allowed border border-white/5">
                Link opens at 7:30 PM
              </button>
            </motion.div>
          )}

          {status === "live" && (
            <motion.div key="live" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                <Users className="w-3.5 h-3.5" />
                <span>142 students joined</span>
              </div>
              <button
                onClick={() => window.open("https://meet.google.com/xyz-abc-123", "_blank")}
                className="w-full py-3 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/15"
              >
                <Video className="w-4 h-4" /> Join Class Now <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}

          {status === "recorded" && (
            <motion.div key="recorded" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              <p className="text-xs text-gray-400">Class ended. Recording is available.</p>
              <button className="w-full py-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 border border-blue-500/20">
                <PlayCircle className="w-4 h-4" /> Watch Recording
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
