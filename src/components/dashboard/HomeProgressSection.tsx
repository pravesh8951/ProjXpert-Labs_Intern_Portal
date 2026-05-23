"use client";

import { motion } from "framer-motion";
import { Zap, Flame, CheckCircle2 } from "lucide-react";

// Level tier names based on level number
function getLevelTier(level: number): { name: string; color: string } {
  if (level >= 10) return { name: "Master", color: "text-red-400" };
  if (level >= 7)  return { name: "Expert", color: "text-purple-400" };
  if (level >= 5)  return { name: "Practitioner", color: "text-blue-400" };
  if (level >= 3)  return { name: "Explorer", color: "text-cyan-400" };
  return { name: "Rookie", color: "text-green-400" };
}

// Streak status message
function getStreakMessage(streak: number): string {
  if (streak >= 14) return "🔥 Unstoppable!";
  if (streak >= 7)  return "💪 On fire!";
  if (streak >= 3)  return "⚡ Keep it up!";
  if (streak === 1) return "🌱 Just started";
  return "🚀 Building momentum";
}

export default function HomeProgressSection({ user, domain }: { user: any, domain: string }) {
  const xp = user.xp ?? 0;
  const level = Math.floor(xp / 200) + 1;
  const currentLevelXP = xp - (level - 1) * 200;
  const nextLevelXP = 200;
  const streak = user.streak ?? 1;
  const { name: tierName, color: tierColor } = getLevelTier(level);
  const streakMsg = getStreakMessage(streak);

  // Current week's day range
  const currentWeekNum = Math.ceil((user.currentDay || 1) / 7);
  const startDay = (currentWeekNum - 1) * 7 + 1;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* ── XP PROGRESSION CARD ── */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden"
      >
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-yellow-500/10 blur-[60px] rounded-full pointer-events-none" />

        <div className="flex justify-between items-start mb-5">
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

        {/* Tier badge */}
        <div className="mb-4">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-white/5 border border-white/10 ${tierColor}`}>
            ★ {tierName}
          </span>
        </div>

        <div>
          <div className="flex justify-between items-end mb-2">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Next Level Progress</span>
            <span className="text-sm font-bold text-white">{currentLevelXP} <span className="text-gray-500">/ {nextLevelXP}</span></span>
          </div>
          <div className="h-2.5 bg-black/40 rounded-full overflow-hidden border border-white/5 relative">
            <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: `${Math.min((currentLevelXP / nextLevelXP) * 100, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full shadow-[0_0_15px_rgba(250,204,21,0.4)]" 
            />
          </div>
          <p className="text-[10px] text-gray-600 mt-2">{nextLevelXP - currentLevelXP} XP to Level {level + 1}</p>
        </div>
      </motion.div>

      {/* ── DAILY STREAK CARD ── */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden"
      >
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-orange-500/10 blur-[60px] rounded-full pointer-events-none" />

        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <Flame className="w-6 h-6 text-orange-500 fill-orange-500/20" />
            </div>
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-0.5">Consistency</p>
              <h3 className="text-xl font-black text-white leading-none">{streak} Day Streak</h3>
            </div>
          </div>
          <span className="text-xs font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-lg">
            {streakMsg}
          </span>
        </div>

        <div className="mt-4">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-3">This Week's Activity</p>
          <div className="flex justify-between gap-1">
            {Array.from({ length: 7 }).map((_, i) => {
              const dayNum = startDay + i;
              const isCompleted  = user.completedDays?.includes(dayNum)     || false;
              const isReadDone   = user.completedReadings?.includes(dayNum) || false;
              const isQuizDone   = user.completedQuizzes?.includes(dayNum)  || false;
              const isPartial    = (isReadDone || isQuizDone) && !isCompleted;
              const isCurrent    = dayNum === (user.currentDay || 1);

              return (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                    isCompleted
                      ? "bg-orange-500/20 border-orange-500/40 shadow-[0_0_10px_rgba(249,115,22,0.2)]"
                      : isPartial
                      ? "bg-cyan-500/10 border-cyan-500/30"
                      : isCurrent
                      ? "bg-blue-500/10 border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]"
                      : "bg-white/5 border-white/10"
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-orange-400" />
                    ) : isPartial ? (
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                    ) : isCurrent ? (
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                    )}
                  </div>
                  <span className={`text-[9px] font-black uppercase ${
                    isCompleted ? "text-orange-400"
                    : isPartial  ? "text-cyan-500"
                    : isCurrent  ? "text-blue-400"
                    : "text-gray-600"
                  }`}>D{dayNum}</span>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center gap-4 border-t border-white/5 pt-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-orange-400" />
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Done</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">In Progress</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Today</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
