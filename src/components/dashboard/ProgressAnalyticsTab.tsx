"use client";

import { motion } from "framer-motion";
import { Target, TrendingUp, Calendar, Zap, CheckCircle, Brain, BookOpen, Clock, Activity, Flag, Flame } from "lucide-react";

// Re-using CircleProgress from the original logic, slightly improved
function CircleProgress({ value, max, color, label, sublabel }: any) {
  const pct = Math.min((value / max) * 100, 100);
  const r = 52, circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
          <motion.circle
            cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="8"
            strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ}
            animate={{ strokeDashoffset: circ - dash }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-extrabold text-white">{Math.round(pct)}%</span>
        </div>
      </div>
      <div>
        <p className="text-white font-bold text-sm text-center">{label}</p>
        <p className="text-gray-500 text-xs text-center mt-0.5">{sublabel}</p>
      </div>
    </div>
  );
}

export default function ProgressAnalyticsTab({ user, courseData, domain }: any) {
  const planWeeks = user.internshipPlan === "3m" ? 12 : user.internshipPlan === "2m" ? 8 : 4;
  const totalDays = planWeeks * 7;
  const currentDay = user.currentDay || 1;
  const quizAcc = user.quizAccuracy || 85;
  const assignmentsDone = user.assignmentsCompleted || 3;
  const xp = user.xp || 320;
  const streak = user.streak || 7;

  const domainColor = domain === "ai" ? "#60a5fa" : "#c084fc"; // blue-400 or purple-400
  
  // Weekly Performance Mock Data for CSS Charts
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const quizScores = [70, 85, 90, 0, 100, 80, 95]; // 0 means not taken

  // Timeline Mock Data
  const timelineEvents = [
    { day: "Today", events: [
      { type: "read", text: "Read Day 5 Content", done: true },
      { type: "quiz", text: "Completed Daily Quiz (95%)", done: true },
      { type: "assignment", text: "Submitted Assignment: Loops & Sets", done: false },
    ]},
    { day: "Yesterday", events: [
      { type: "milestone", text: "Finished Module 1", done: true },
    ]}
  ];

  const allWeeks = courseData?.months?.flatMap((m: any) => m.weeks) || [];
  const visibleWeeks = allWeeks.slice(0, planWeeks);

  return (
    <div className="space-y-10 pb-20">
      <div className="flex items-center gap-3">
        <Activity className="w-6 h-6 text-white" />
        <h2 className="text-2xl font-black text-white">Analytics Dashboard</h2>
      </div>

      {/* ── A. OVERVIEW SECTION ── */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 bg-[#0d0f22] border border-white/5 rounded-3xl p-8 flex items-center justify-around shadow-xl">
          <CircleProgress value={currentDay} max={totalDays} color={domainColor} label="Internship" sublabel={`Day ${currentDay} of ${totalDays}`} />
          <div className="w-px h-24 bg-white/5" />
          <CircleProgress value={quizAcc} max={100} color="#00d4ff" label="Quiz Accuracy" sublabel={`${quizAcc}% average`} />
          <div className="w-px h-24 bg-white/5 hidden sm:block" />
          <div className="hidden sm:block">
            <CircleProgress value={assignmentsDone} max={totalDays / 3} color="#f59e0b" label="Assignments" sublabel={`${assignmentsDone} submitted`} />
          </div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-yellow-400" />
            </div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total XP</p>
          </div>
          <p className="text-4xl font-black text-white mb-1">{xp}</p>
          <p className="text-xs text-green-400 font-bold flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +150 this week</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Active Streak</p>
          </div>
          <p className="text-4xl font-black text-white mb-1">{streak}</p>
          <p className="text-xs text-gray-500 font-bold">Top 15% of learners</p>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* ── B. WEEKLY PERFORMANCE TRACKER ── */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" /> Weekly Performance Trend
          </h3>
          <div className="bg-[#0d0f22] border border-white/5 rounded-3xl p-8 shadow-xl">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-6">Quiz Accuracy by Day</p>
            
            {/* CSS Bar Chart */}
            <div className="h-48 flex items-end justify-between gap-2 border-b border-white/10 pb-2 relative">
              {/* Grid lines */}
              <div className="absolute left-0 right-0 bottom-1/2 h-px bg-white/5" />
              <div className="absolute left-0 right-0 top-0 h-px bg-white/5" />
              
              {quizScores.map((score, i) => (
                <div key={i} className="flex-1 flex flex-col items-center group relative z-10">
                  <motion.div 
                    initial={{ height: 0 }} animate={{ height: `${score}%` }} 
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className={`w-full max-w-[2.5rem] rounded-t-xl transition-all ${
                      score > 80 ? "bg-gradient-to-t from-blue-600/50 to-cyan-400" :
                      score > 0 ? "bg-gradient-to-t from-yellow-600/50 to-yellow-400" :
                      "bg-white/5"
                    } hover:brightness-125`}
                  >
                    {score > 0 && (
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        {score}%
                      </span>
                    )}
                  </motion.div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4">
              {weekDays.map((day, i) => (
                <div key={i} className="flex-1 text-center text-xs font-bold text-gray-500 uppercase">{day}</div>
              ))}
            </div>
            
            <div className="mt-8 flex gap-6 border-t border-white/5 pt-6">
              <div>
                <p className="text-2xl font-black text-white">4/5</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Assignments Submitted</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">92%</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Avg Quiz Score</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── C. LEARNING ACTIVITY TIMELINE ── */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-400" /> Recent Activity
          </h3>
          <div className="bg-[#0d0f22] border border-white/5 rounded-3xl p-6 shadow-xl h-full">
            <div className="relative border-l border-white/10 ml-3 space-y-8 py-2">
              {timelineEvents.map((group, i) => (
                <div key={i}>
                  <div className="absolute -left-[5px] w-2.5 h-2.5 rounded-full bg-white/20 mt-1" />
                  <div className="pl-6 mb-4">
                    <p className="text-xs font-black text-gray-500 uppercase tracking-wider">{group.day}</p>
                  </div>
                  <div className="pl-6 space-y-4">
                    {group.events.map((ev, j) => (
                      <div key={j} className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
                        ev.done ? "bg-white/5 border-white/5" : "bg-white/[0.02] border-transparent opacity-60"
                      }`}>
                        {ev.type === "read" && <BookOpen className={`w-4 h-4 ${ev.done ? "text-green-400" : "text-gray-500"}`} />}
                        {ev.type === "quiz" && <Brain className={`w-4 h-4 ${ev.done ? "text-cyan-400" : "text-gray-500"}`} />}
                        {ev.type === "assignment" && <CheckCircle className={`w-4 h-4 ${ev.done ? "text-yellow-400" : "text-gray-500"}`} />}
                        {ev.type === "milestone" && <Flag className={`w-4 h-4 ${ev.done ? "text-purple-400" : "text-gray-500"}`} />}
                        <p className={`text-xs font-semibold ${ev.done ? "text-white" : "text-gray-400"}`}>{ev.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── D. MODULE PROGRESS TRACKING ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pt-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-green-400" /> Module Completion Analytics
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleWeeks.map((mod: any, i: number) => {
            const isLocked = mod.week > Math.ceil(currentDay / 7);
            const isCurrent = mod.week === Math.ceil(currentDay / 7);
            const isCompleted = mod.week < Math.ceil(currentDay / 7);

            return (
              <div key={i} className={`p-6 rounded-3xl border transition-all ${
                isCompleted ? "bg-green-500/[0.03] border-green-500/20" :
                isCurrent ? "bg-blue-500/[0.05] border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.05)]" :
                "bg-white/[0.02] border-white/5 opacity-60"
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${
                    isCompleted ? "bg-green-500/10 text-green-400" :
                    isCurrent ? "bg-blue-500/10 text-blue-400" :
                    "bg-white/5 text-gray-500"
                  }`}>
                    Module {mod.week}
                  </span>
                  <span className="text-xs font-bold text-white">{isCompleted ? "100%" : isCurrent ? "40%" : "0%"}</span>
                </div>
                
                <h4 className={`text-base font-bold mb-6 line-clamp-1 ${isLocked ? "text-gray-400" : "text-white"}`}>
                  {mod.title}
                </h4>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-medium">Reading Content</span>
                    <span className={isCompleted || isCurrent ? "text-green-400 font-bold" : "text-gray-600"}>
                      {isCompleted ? "7/7 Days" : isCurrent ? "3/7 Days" : "0/7 Days"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-medium">Weekly Quiz</span>
                    <span className={isCompleted ? "text-white font-bold" : "text-gray-600"}>
                      {isCompleted ? "Passed (92%)" : "Pending"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-medium">Project Assignment</span>
                    <span className={isCompleted ? "text-yellow-400 font-bold" : "text-gray-600"}>
                      {isCompleted ? "Graded A+" : "Pending"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
