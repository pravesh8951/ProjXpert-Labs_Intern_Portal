"use client";

import { motion } from "framer-motion";
import { Zap, Flame, Star, Target, CheckCircle2 } from "lucide-react";

export default function HomeProgressSection({ user, domain }: { user: any, domain: string }) {
  const xp = user.xp || 320;
  const level = user.level || 3;
  const nextLevelXP = level * 200;
  const streak = user.streak || 7;
  
  const domainColor = domain === "ai" ? "text-blue-400" : "text-purple-400";
  const domainBg = domain === "ai" ? "bg-blue-500/10 border-blue-500/20" : "bg-purple-500/10 border-purple-500/20";

  // Mock 7-day activity (Mon-Sun)
  const weeklyActivity = [true, true, true, false, true, true, true]; // Example

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* ── XP PROGRESSION CARD ── */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden"
      >
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-yellow-500/10 blur-[60px] rounded-full pointer-events-none" />
        
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-yellow-400 fill-yellow-400/20" />
            </div>
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-0.5">Experience</p>
              <h3 className="text-xl font-black text-white leading-none">Level {level}</h3>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-yellow-400">{xp}</p>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total XP</p>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-end mb-2">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Next Level Progress</span>
            <span className="text-sm font-bold text-white">{xp} <span className="text-gray-500">/ {nextLevelXP}</span></span>
          </div>
          <div className="h-2.5 bg-black/40 rounded-full overflow-hidden border border-white/5 relative">
            <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: `${Math.min((xp / nextLevelXP) * 100, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full shadow-[0_0_15px_rgba(250,204,21,0.4)]" 
            />
          </div>
        </div>
      </motion.div>

      {/* ── DAILY STREAK CARD ── */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden"
      >
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-orange-500/10 blur-[60px] rounded-full pointer-events-none" />
        
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <Flame className="w-6 h-6 text-orange-500 fill-orange-500/20" />
            </div>
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-0.5">Consistency</p>
              <h3 className="text-xl font-black text-white leading-none">{streak} Day Streak</h3>
            </div>
          </div>
        </div>

        <div className="mt-auto">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-3">This Week's Activity</p>
          <div className="flex justify-between gap-1">
            {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => {
              const isActive = weeklyActivity[i];
              return (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                    isActive 
                      ? "bg-orange-500/20 border-orange-500/40 shadow-[0_0_10px_rgba(249,115,22,0.2)]" 
                      : "bg-white/5 border-white/10"
                  }`}>
                    {isActive ? <CheckCircle2 className="w-4 h-4 text-orange-400" /> : <div className="w-1.5 h-1.5 rounded-full bg-white/10" />}
                  </div>
                  <span className="text-[9px] font-bold text-gray-500 uppercase">{day}</span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
