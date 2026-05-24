"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, CheckCircle, Play, ChevronDown, Trophy, Clock, BookOpen, Target, Sparkles, LayoutList, X } from "lucide-react";

export default function LearningModules({ user, courseData, domain }: { user: any, courseData: any, domain: string }) {
  const [expandedModule, setExpandedModule] = useState<number | null>(null);
  const [selectedDayData, setSelectedDayData] = useState<any>(null);

  const allWeeks = courseData?.months?.flatMap((m: any) => m.weeks) || [];
  
  // Calculate total allowed duration based on plan
  const planWeeks = user.internshipPlan === "3m" ? 12 : user.internshipPlan === "2m" ? 8 : 4;
  const totalDays = planWeeks * 7;
  const currentDay = user.currentDay || 1;
  const currentWeekNum = Math.ceil(currentDay / 7);

  // Visible modules (weeks) depending on the user's purchased plan
  const visibleWeeks = allWeeks.slice(0, planWeeks);

  // Find the current module (week) data for the header
  const currentModuleData = visibleWeeks.find((w: any) => w.week === currentWeekNum) || visibleWeeks[0];

  const toggleModule = (weekNum: number) => {
    setExpandedModule(prev => prev === weekNum ? null : weekNum);
  };

  const domainColor = domain === "ai" ? "text-blue-400" : "text-purple-400";
  const domainBg = domain === "ai" ? "bg-blue-500/10 border-blue-500/20" : "bg-purple-500/10 border-purple-500/20";
  const domainAccent = domain === "ai" ? "bg-blue-600 hover:bg-blue-500 shadow-blue-600/20" : "bg-purple-600 hover:bg-purple-500 shadow-purple-600/20";

  return (
    <div className="space-y-8">
      {/* ── TOP SECTION: Dashboard & Progress ── */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Continue Learning Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2 relative overflow-hidden bg-gradient-to-br from-[#0d0f22] to-[#131532] border border-white/10 rounded-3xl p-8 shadow-xl"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between md:items-end gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${domainBg} ${domainColor}`}>
                  Module {currentModuleData?.week || 1}
                </span>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white/5 text-gray-400 border border-white/5 flex items-center gap-1">
                  <Target className="w-3 h-3" /> Day {currentDay}
                </span>
              </div>
              <h2 className="text-2xl font-black text-white mb-2 leading-tight">
                {currentModuleData?.title || "Continuing Your Journey"}
              </h2>
              <p className="text-gray-400 text-sm font-medium">Keep up the momentum. You're doing great!</p>
            </div>
            
            <button 
              onClick={() => window.location.href = "/dashboard?tab=home&action=continue-learning"}
              className={`whitespace-nowrap px-6 py-3 text-white font-bold text-sm rounded-xl transition-all shadow-lg flex items-center gap-2 ${domainAccent}`}
            >
              <Play className="w-4 h-4 fill-current" /> Continue Learning
            </button>
          </div>
        </motion.div>

        {/* Progress & Stats Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-center"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white font-bold flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-400" /> Overall Progress
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/10 text-gray-300">
              {user.internshipPlan === "3m" ? "3 Months" : user.internshipPlan === "2m" ? "2 Months" : "1 Month"} Plan
            </span>
          </div>
          
          <div className="mb-2 flex justify-between items-end">
            <span className="text-3xl font-black text-white">{Math.round((currentDay/totalDays)*100)}%</span>
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">{currentDay} / {totalDays} Days</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-4">
            <motion.div 
              initial={{ width: 0 }} animate={{ width: `${(currentDay/totalDays)*100}%` }}
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" 
            />
          </div>
        </motion.div>
      </div>

      {/* ── EXPANDABLE ROADMAP ── */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <LayoutList className="w-6 h-6 text-white" />
          <h2 className="text-2xl font-black text-white">Internship Roadmap</h2>
        </div>

        {visibleWeeks.map((weekData: any, i: number) => {
          const moduleDays = weekData.days?.map((d: any) => d.day) || [];
          const unlockedDaysList = user.unlockedDays || [1];
          const isComingSoon = moduleDays.length === 0;
          const isModuleLocked = isComingSoon || !moduleDays.some((d: number) => unlockedDaysList.includes(d));
          const isModuleCompleted = !isComingSoon && moduleDays.every((d: number) => user.completedDays?.includes(d));
          const isModuleCurrent = !isModuleLocked && !isModuleCompleted;
          
          const isExpanded = expandedModule === (weekData.week || `placeholder-${i}`);
          const displayWeekNum = weekData.week || (i + 1);

          return (
            <motion.div 
              key={`module-week-${weekData.week}-index-${i}`} 
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                isModuleLocked 
                  ? "bg-white/[0.015] border-white/5" 
                  : "bg-[#0d0f22]/80 border-white/10 hover:border-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.02)]"
              }`}
            >
              {/* Module Header (Click to expand — always clickable) */}
              <div 
                onClick={() => !isComingSoon && toggleModule(weekData.week || `placeholder-${i}`)}
                className={`p-5 sm:p-6 flex items-center justify-between gap-4 ${isComingSoon ? "cursor-not-allowed" : "cursor-pointer"} ${isModuleLocked ? "opacity-70 hover:opacity-90" : ""} transition-opacity`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border ${
                    isModuleCompleted ? "bg-green-500/10 border-green-500/20 text-green-400" :
                    isModuleCurrent ? `${domainBg} ${domainColor}` :
                    isComingSoon ? "bg-orange-500/10 border-orange-500/20 text-orange-400" :
                    "bg-white/5 border-white/10 text-gray-500"
                  }`}>
                    {isModuleCompleted ? <CheckCircle className="w-5 h-5" /> : 
                     isModuleCurrent ? <Sparkles className="w-5 h-5" /> : 
                     isComingSoon ? <Clock className="w-5 h-5" /> :
                     <Lock className="w-5 h-5" />}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                        Module {displayWeekNum}
                      </span>
                      {isComingSoon ? (
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" /> Coming Soon
                        </span>
                      ) : (
                        <>
                          {isModuleCurrent && (
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${domainBg} ${domainColor}`}>
                              In Progress
                            </span>
                          )}
                          {isModuleLocked && (
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-white/5 text-gray-500 border border-white/10 flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5" /> Locked
                            </span>
                          )}
                          {isModuleCompleted && (
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-green-500/10 text-green-400 border border-green-500/20">
                              Completed
                            </span>
                          )}
                        </>
                      )}
                    </div>
                    <h3 className={`font-bold text-lg leading-tight ${
                      isModuleLocked ? "text-gray-400" : "text-white"
                    }`}>
                      {weekData.title}
                    </h3>
                  </div>
                </div>

                {!isComingSoon && (
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400">
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                  </div>
                )}
              </div>

              {/* Expandable Content (Day Cards) */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 sm:p-6 pt-0 border-t border-white/5 bg-black/20">
                      <div className="mt-6 space-y-3 relative">
                        {/* Connecting Line */}
                        <div className="absolute left-6 top-4 bottom-4 w-px bg-white/10" />

                        {weekData.days?.map((dayObj: any, dayIdx: number) => {
                          const isDayCompleted = user.completedDays?.includes(dayObj.day);
                          const isDayLocked = !(user.unlockedDays?.includes(dayObj.day) || dayObj.day === 1);
                          const isDayCurrent = !isDayLocked && !isDayCompleted;

                          return (
                            <div 
                              key={`w${weekData.week}-d${dayIdx}`}
                              className={`relative pl-16 pr-4 py-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                                isDayCompleted ? "bg-green-500/5 border-green-500/10 hover:border-green-500/20" :
                                isDayCurrent ? `${domainBg} hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]` :
                                "bg-white/5 border-transparent opacity-70"
                              }`}
                            >
                              {/* Status Icon */}
                              <div className={`absolute left-4 w-4 h-4 rounded-full border-2 flex items-center justify-center bg-[#0d0f22] z-10 ${
                                isDayCompleted ? "border-green-400 bg-green-500/20" :
                                isDayCurrent ? "border-blue-400 bg-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.5)]" :
                                "border-white/20"
                              }`}>
                                {isDayCompleted && <CheckCircle className="w-2.5 h-2.5 text-green-400" />}
                                {isDayCurrent && <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                              </div>

                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`text-[10px] font-black uppercase tracking-wider ${
                                    isDayCompleted ? "text-green-400/80" :
                                    isDayCurrent ? domainColor :
                                    "text-gray-500"
                                  }`}>
                                    Day {dayObj.day}
                                  </span>
                                  <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> ~15m
                                  </span>
                                </div>
                                <h4 className={`text-sm font-bold ${
                                  isDayLocked ? "text-gray-400" : "text-white"
                                }`}>
                                  {dayObj.title}
                                </h4>
                                {dayObj.content?.theory && (
                                  <p className="text-xs text-gray-500 mt-1 line-clamp-1 max-w-xl">
                                    {dayObj.content.theory}
                                  </p>
                                )}
                              </div>

                              {/* Action Button */}
                              {!isDayLocked && (
                                <button 
                                  onClick={() => setSelectedDayData(dayObj)}
                                  className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                  isDayCurrent 
                                    ? "bg-white text-black hover:bg-gray-200" 
                                    : "bg-white/10 text-white hover:bg-white/20"
                                }`}>
                                  {isDayCurrent ? (
                                    <>
                                      <Play className="w-3 h-3 fill-current" /> Start
                                    </>
                                  ) : (
                                    <>
                                      <BookOpen className="w-3 h-3" /> Review
                                    </>
                                  )}
                                </button>
                              )}
                              
                              {isDayLocked && (
                                <div className="flex-shrink-0 px-4 py-2 flex items-center gap-1.5 text-xs font-bold text-gray-500">
                                  <Lock className="w-3 h-3" /> Locked
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* ── FULL READER MODAL ── */}
      <AnimatePresence>
        {selectedDayData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#070714] flex flex-col"
          >
            {/* Sticky top bar */}
            <div className="px-6 lg:px-10 py-4 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#0d0f22]/95 backdrop-blur-sm z-20">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20 ${domainColor}`}>
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-white font-extrabold text-base">{selectedDayData.title}</h5>
                  <p className="text-gray-400 text-xs font-mono">Module {Math.ceil(selectedDayData.day / 7)} · Day {selectedDayData.day}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDayData(null)}
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Reading content */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-6xl mx-auto px-8 sm:px-14 lg:px-20 py-12 space-y-10">
                {/* ── Article Header ── */}
                <header className="space-y-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-3 py-1 rounded-lg text-[11px] font-extrabold uppercase tracking-wider ${domainBg} ${domainColor}`}>
                      DAY {selectedDayData.day}
                    </span>
                    <span className="px-3 py-1 rounded-lg text-[11px] font-bold bg-white/5 text-gray-400 border border-white/5 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> 15 min read
                    </span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight tracking-tight">
                    {selectedDayData.title}
                  </h1>
                  <div className="h-px bg-gradient-to-r from-blue-500/30 via-purple-500/20 to-transparent" />
                </header>

                {/* ── Theory / Main Content ── */}
                <article className="prose-custom">
                  <div className="text-gray-300 text-[16px] sm:text-[17px] leading-[1.9] whitespace-pre-wrap tracking-wide font-normal">
                    {selectedDayData.content?.theory || "Content coming soon..."}
                  </div>
                </article>

                {/* ── Key Takeaways ── */}
                {selectedDayData.content?.keyPoints?.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-blue-500/[0.06] to-cyan-500/[0.03] border border-blue-500/15 rounded-2xl p-7 sm:p-8"
                  >
                    <h3 className="text-white font-extrabold text-lg mb-5 flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-blue-500/15 border border-blue-500/25">
                        <CheckCircle className="w-5 h-5 text-blue-400" />
                      </div>
                      Key Takeaways
                    </h3>
                    <ul className="space-y-4">
                      {selectedDayData.content.keyPoints.map((point: string, idx: number) => (
                        <li key={idx} className="flex gap-4 items-start text-[15px] text-gray-300 leading-relaxed">
                          <span className="w-7 h-7 rounded-full bg-blue-500 text-slate-900 flex items-center justify-center text-xs font-extrabold flex-shrink-0 mt-0.5 shadow-lg shadow-blue-500/20">
                            {idx + 1}
                          </span>
                          <span className="pt-0.5">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {/* ── Complete button ── */}
                <div className="pb-10 pt-4">
                  {selectedDayData.day === currentDay ? (
                    <button
                      onClick={() => {
                        setSelectedDayData(null);
                      }}
                      className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-base rounded-xl transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 group"
                    >
                      <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" /> Mark as Completed
                    </button>
                  ) : selectedDayData.day < currentDay ? (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-full py-4 bg-green-500/10 border border-green-500/20 text-green-400 font-bold text-base rounded-xl flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" /> Lesson Complete!
                    </motion.div>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Reading progress bar at bottom */}
            <div className="h-1 bg-white/5 sticky bottom-0">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ margin: "0px 0px -50px 0px" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
