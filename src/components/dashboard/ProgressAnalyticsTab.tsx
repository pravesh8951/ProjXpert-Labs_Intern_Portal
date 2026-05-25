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
  const currentDay = user.unlockedDays?.length > 0 ? Math.max(...user.unlockedDays) : (user.currentDay ?? 1);
  const assignmentsDone = user.assignmentsCompleted ?? 0;
  const xp = user.xp ?? 0;
  const streak = Math.max(currentDay - 1, 0);

  const domainColor = domain === "ai" ? "#60a5fa" : "#c084fc";

  // ── Compute live quiz accuracy from dailyQuizScores ──
  const allScores: { day: number; score: number; total: number; passed?: boolean; percentage?: number }[] = user.dailyQuizScores || [];
  const liveQuizAcc = allScores.length > 0
    ? Math.round(
        allScores.reduce((sum, s) => sum + (s.total > 0 ? s.score / s.total : 0), 0) /
          allScores.length * 100
      )
    : (user.quizAccuracy ?? 0);

  // ── Weekly bar chart: last 7 quiz days (sorted by day) ──
  const recentQuizzes = [...allScores].sort((a, b) => b.day - a.day).slice(0, 7).reverse();
  const barData: { label: string; score: number }[] = recentQuizzes.map((s) => ({
    label: `Day ${s.day}`,
    score: s.percentage !== undefined ? s.percentage : (s.total > 0 ? Math.round((s.score / s.total) * 100) : (s.passed ? 100 : 0)),
  }));

  // ── XP gained this week (last 7 completed quiz days) ──
  const xpPerQuiz = 10; // same as backend
  const xpThisWeek = recentQuizzes.filter((s) => s.score > 0).length * xpPerQuiz;

  // Generate real-time timeline events based on actual completions
  const events: any[] = [];
  for (let d = currentDay; d >= 1; d--) {
    const dayEvents: any[] = [];
    
    if (user.completedReadings?.includes(d)) {
      dayEvents.push({
        type: "read",
        text: `Read Day ${d} Content`,
        done: true
      });
    }
    
    if (user.completedQuizzes?.includes(d)) {
      const scoreObj = user.dailyQuizScores?.find((s: any) => s.day === d);
      const scorePct = scoreObj && scoreObj.total > 0 ? Math.round((scoreObj.score / scoreObj.total) * 100) : null;
      dayEvents.push({
        type: "quiz",
        text: `Completed Daily Quiz (Day ${d})${scorePct !== null ? ` - ${scorePct}%` : ""}`,
        done: true
      });
    }
    
    if (user.completedDays?.includes(d)) {
      dayEvents.push({
        type: "milestone",
        text: `Finished Day ${d} Challenges`,
        done: true
      });
    }
    
    if (d % 7 === 0 && user.completedDays?.includes(d)) {
      dayEvents.push({
        type: "milestone",
        text: `Finished Module ${Math.ceil(d / 7)}`,
        done: true
      });
    }

    if (dayEvents.length > 0) {
      events.push({
        day: `Day ${d}`,
        events: dayEvents,
        dayNum: d
      });
    }
  }
  
  if (events.length === 0) {
    events.push({
      day: "Get Started",
      events: [
        { type: "milestone", text: "Started your internship journey! 🚀", done: true }
      ],
      dayNum: 0
    });
  }
  // Restrict to ONLY last 2 days of activity
  const timelineEvents = events.slice(0, 2);

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
          <CircleProgress value={liveQuizAcc} max={100} color="#00d4ff" label="Quiz Accuracy" sublabel={`${liveQuizAcc}% average`} />
          <div className="w-px h-24 bg-white/5 hidden sm:block" />
          <div className="hidden sm:block">
            <CircleProgress value={assignmentsDone} max={planWeeks} color="#f59e0b" label="Assignments" sublabel={`${assignmentsDone} submitted`} />
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
          <p className="text-xs text-green-400 font-bold flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +{xpThisWeek} this week</p>
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
          <div className="bg-[#0d0f22] border border-white/5 rounded-3xl p-8 shadow-xl h-full flex flex-col">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-6">
              Quiz Accuracy — Last {barData.length} Completed Day{barData.length !== 1 ? "s" : ""}
            </p>

            {allScores.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-center gap-3">
                <Brain className="w-8 h-8 text-gray-600" />
                <p className="text-gray-500 text-sm font-semibold">No quiz data yet</p>
                <p className="text-gray-600 text-xs">Complete your first daily quiz to see performance trends</p>
              </div>
            ) : (
              <>
                {/* CSS Bar Chart */}
                <div className="h-48 flex items-end justify-between gap-2 border-b border-white/10 pb-2 relative">
                  {/* Grid lines */}
                  <div className="absolute left-0 right-0 bottom-1/2 h-px bg-white/5" />
                  <div className="absolute left-0 right-0 top-0 h-px bg-white/5" />

                  {barData.map((bar, i) => (
                    <div key={i} className="flex-1 h-full flex flex-col justify-end items-center group relative z-10">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: bar.score > 0 ? `${bar.score}%` : "4px" }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className={`w-full max-w-[2.5rem] rounded-t-xl transition-all ${
                          bar.score >= 80 ? "bg-gradient-to-t from-blue-600/50 to-cyan-400" :
                          bar.score >= 50 ? "bg-gradient-to-t from-yellow-600/50 to-yellow-400" :
                          bar.score > 0  ? "bg-gradient-to-t from-red-600/50 to-red-400" :
                          "bg-white/5"
                        } hover:brightness-125`}
                      >
                        {bar.score > 0 && (
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {bar.score}%
                          </span>
                        )}
                      </motion.div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4">
                  {barData.map((bar, i) => (
                    <div key={i} className={`flex-1 text-center text-[10px] font-bold uppercase ${
                      bar.label === "—" ? "text-gray-700" : "text-gray-500"
                    }`}>{bar.label}</div>
                  ))}
                </div>
              </>
            )}

            <div className="mt-auto flex gap-6 border-t border-white/5 pt-6">
              <div>
                <p className="text-2xl font-black text-white">{assignmentsDone} / {planWeeks}</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Assignments Submitted</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">{liveQuizAcc}%</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Avg Quiz Accuracy</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">{allScores.length}</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Quizzes Taken</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── C. LEARNING ACTIVITY TIMELINE ── */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-400" /> Recent Activity
          </h3>
          <div className="bg-[#0d0f22] border border-white/5 rounded-3xl p-6 shadow-xl h-full overflow-y-auto custom-scrollbar">
            <div className="relative border-l border-white/10 ml-3 space-y-8 py-2 pr-2">
              {timelineEvents.map((group, i) => (
                <div key={i}>
                  <div className="absolute -left-[5px] w-2.5 h-2.5 rounded-full bg-white/20 mt-1" />
                  <div className="pl-6 mb-4">
                    <p className="text-xs font-black text-gray-500 uppercase tracking-wider">{group.day}</p>
                  </div>
                  <div className="pl-6 space-y-4">
                    {group.events.map((ev: any, j: number) => (
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

            const completedReadingsInWeek = mod.days?.filter((d: any) => user.completedReadings?.includes(d.day)).length || 0;
            const completedQuizzesInWeek = mod.days?.filter((d: any) => user.completedQuizzes?.includes(d.day)).length || 0;
            const isAssignmentSubmitted = user.assignmentsCompleted >= mod.week;
            
            const totalTasksInWeek = (mod.days?.length || 7) * 2 + 1; // readings + quizzes + 1 assignment
            const completedTasksInWeek = completedReadingsInWeek + completedQuizzesInWeek + (isAssignmentSubmitted ? 1 : 0);
            const completionPct = Math.round((completedTasksInWeek / totalTasksInWeek) * 100);

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
                  <span className="text-xs font-bold text-white">{completionPct}%</span>
                </div>
                
                <h4 className={`text-base font-bold mb-6 line-clamp-1 ${isLocked ? "text-gray-400" : "text-white"}`}>
                  {mod.title}
                </h4>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-medium">Reading Content</span>
                    <span className={isCompleted || isCurrent ? "text-green-400 font-bold" : "text-gray-600"}>
                      {completedReadingsInWeek}/{mod.days?.length || 7} Days
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-medium">Weekly Quizzes</span>
                    <span className={isCompleted || isCurrent ? "text-white font-bold" : "text-gray-600"}>
                      {completedQuizzesInWeek}/{mod.days?.length || 7} Passed
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-medium">Project Assignment</span>
                    <span className={isAssignmentSubmitted ? "text-yellow-400 font-bold" : "text-gray-600"}>
                      {isAssignmentSubmitted ? "Submitted" : "Pending"}
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
