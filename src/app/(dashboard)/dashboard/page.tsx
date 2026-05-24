"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Brain, Shield, Flame, Star, Trophy, BookOpen, Clock, CheckCircle, Lock, Zap, Target, Award, BarChart3, Calendar, Upload, Play } from "lucide-react";

// New Dashboard Components
import LiveClassCard from "@/components/dashboard/LiveClassCard";
import DailyContentHub from "@/components/dashboard/DailyContentHub";
import LearningModules from "@/components/dashboard/LearningModules";
import HomeProgressSection from "@/components/dashboard/HomeProgressSection";
import ProgressAnalyticsTab from "@/components/dashboard/ProgressAnalyticsTab";


const quotes = [
  "The expert in anything was once a beginner.",
  "Code. Learn. Build. Repeat.",
  "Every line of code is a step toward mastery.",
  "Security is not a product, but a process.",
];

const roadmapAI = [
  { title: "Python Basics", done: true },
  { title: "Data Structures", done: true },
  { title: "Machine Learning", done: true },
  { title: "Deep Learning", done: false, current: true },
  { title: "NLP & Transformers", done: false },
  { title: "Generative AI", done: false },
  { title: "AI Deployment", done: false },
];

const roadmapCyber = [
  { title: "Linux Fundamentals", done: true },
  { title: "Networking Basics", done: true },
  { title: "Web Security", done: true },
  { title: "Ethical Hacking", done: false, current: true },
  { title: "Malware Analysis", done: false },
  { title: "CTF Challenges", done: false },
  { title: "Pen Testing", done: false },
];

const allBadges = [
  { id: "streak7", icon: "🔥", label: "7-Day Streak", desc: "Active 7 days in a row", threshold: 7, field: "streak" },
  { id: "quizmaster", icon: "🧠", label: "Quiz Master", desc: "Score 90%+ accuracy", threshold: 90, field: "quizAccuracy" },
  { id: "fastlearner", icon: "⚡", label: "Fast Learner", desc: "Complete Day 1 in time", threshold: 1, field: "currentDay" },
  { id: "cyber", icon: "🛡", label: "Cyber Defender", desc: "Finish Cyber module", threshold: 0, field: "none" },
  { id: "xp500", icon: "🏆", label: "XP Champion", desc: "Earn 500 XP", threshold: 500, field: "xp" },
  { id: "assign5", icon: "📋", label: "Assignment Pro", desc: "Submit 5 assignments", threshold: 5, field: "assignmentsCompleted" },
];

function CircleProgress({ value, max, color, label, sublabel }: any) {
  const pct = Math.min((value / max) * 100, 100);
  const r = 52, circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
          <motion.circle
            cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="10"
            strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ}
            animate={{ strokeDashoffset: circ - dash }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-extrabold text-white">{Math.round(pct)}%</span>
        </div>
      </div>
      <p className="text-white font-semibold text-sm text-center">{label}</p>
      <p className="text-gray-500 text-xs text-center">{sublabel}</p>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--background)] flex items-center justify-center text-[var(--text-primary)]">Loading Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const [user, setUser] = useState<any>(null);
  const [courseData, setCourseData] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "home";
  const action = searchParams.get("action");
  
  const [quoteIdx] = useState(() => Math.floor(Math.random() * quotes.length));

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/auth/me", { cache: "no-store", signal: controller.signal })
      .then(async (r) => {
        if (!r.ok) { window.location.replace("/login"); return; }
        const d = await r.json();
        if (!d.user) { window.location.replace("/login"); return; }
        setUser(d.user);
        setAuthChecked(true);
        
        // Fetch Course Data from DB
        const domain = d.user.domain || "cybersecurity";
        const cRes = await fetch(`/api/courses?domain=${domain}`);
        if (cRes.ok) {
          const courses = await cRes.json();
          if (courses.length > 0) setCourseData(courses[0]);
        }
      })
      .catch(() => {
        window.location.replace("/login");
      });
    return () => controller.abort();
  }, []);

  if (!user) return (
    <div className="min-h-screen bg-[var(--background)] pt-24 px-4 flex flex-col items-center">
      <div className="w-full max-w-7xl animate-pulse space-y-8">
        <div className="h-48 bg-black/5 dark:bg-white/5 rounded-3xl" />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 h-96 bg-black/5 dark:bg-white/5 rounded-3xl" />
          <div className="h-96 bg-black/5 dark:bg-white/5 rounded-3xl" />
        </div>
      </div>
    </div>
  );

  const domain = user.domain || "ai";
  
  // Flatten all weeks from months into a single roadmap for the timeline
  const allWeeks = courseData?.months?.flatMap((m: any) => m.weeks) || [];
  
  const roadmap = allWeeks.length > 0 ? allWeeks.map((w: any) => ({
    title: w.title,
    done: w.week < (user.currentDay / 7) + 1,
    current: w.week === Math.ceil(user.currentDay / 7),
    week: w.week
  })) : (domain === "ai" ? roadmapAI : roadmapCyber);

  // Find Today's specific content
  const currentWeekObj = allWeeks.find((w: any) => w.week === Math.ceil(user.currentDay / 7));
  const currentDayData = currentWeekObj?.days?.find((d: any) => d.day === user.currentDay);
  
  const totalDays = user.internshipPlan === "3m" ? 90 : user.internshipPlan === "2m" ? 60 : 30;
  const currentDay = user.currentDay ?? 1;

  // Calendar-based day for Live Class — governed by wall-clock time since
  // registration (Day 1 until midnight of sign-up day, Day 2 the next day…)
  // so completing reading+quiz early does NOT advance the live class topic.
  const liveClassDay = (() => {
    if (!user.createdAt) return currentDay;
    const regMidnight = new Date(user.createdAt);
    regMidnight.setHours(0, 0, 0, 0);
    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);
    const calendarDay = Math.floor((todayMidnight.getTime() - regMidnight.getTime()) / 86400000) + 1;
    return Math.min(Math.max(calendarDay, 1), totalDays);
  })();

  const xp = user.xp ?? 0;
  const level = Math.floor(xp / 200) + 1;
  const currentLevelXP = xp - (level - 1) * 200;
  const nextLevelXP = 200;
  const streak = user.streak ?? 1;
  const assignmentsDone = user.assignmentsCompleted ?? 0;
  const quizAcc = user.quizAccuracy ?? 0;
  const earnedBadges = user.badges ?? [];

  const renderOnboardingBanner = () => {
    if (user.testStatus !== "passed") {
      return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Welcome! Your journey begins here.</h2>
            <p className="text-cyan-100/80">Take the eligibility test to unlock your customized internship path.</p>
          </div>
          <button onClick={() => window.location.href = "/test"} className="whitespace-nowrap px-8 py-3 bg-cyan-500 text-slate-900 font-bold rounded-xl hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            Take Eligibility Test
          </button>
        </motion.div>
      );
    }
    
    if (user.paymentStatus !== "completed") {
      return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 bg-gradient-to-r from-[#7c3aed]/20 to-pink-500/20 border border-[#7c3aed]/30 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Ready to start learning?</h2>
            <p className="text-pink-100/80">You've passed the test! Select a plan to finalize your enrollment and access the dashboard features.</p>
          </div>
          <button onClick={() => window.location.href = "/plans"} className="whitespace-nowrap px-8 py-3 bg-[#7c3aed] text-white font-bold rounded-xl hover:bg-[#6d28d9] transition-all shadow-[0_0_20px_rgba(124,58,237,0.4)]">
            View Pricing Plans
          </button>
        </motion.div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[var(--background)] pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {renderOnboardingBanner()}

        {/* ── HOME TAB ── */}
        {tab === "home" && (
          <div className="grid lg:grid-cols-12 gap-8">
            
            {/* Left Column: Welcome & Daily Content (8 cols) */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Welcome Banner */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden bg-gradient-to-br from-purple-600/10 to-blue-500/5 border border-white/5 rounded-2xl p-8"
              >
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div>
                    <div className="flex items-center gap-2.5 mb-4">
                      <div className={`p-2 rounded-xl border ${domain === "ai" ? "bg-blue-500/10 border-blue-500/20" : "bg-purple-500/10 border-purple-500/20"}`}>
                        {domain === "ai" ? <Brain className="w-4 h-4 text-blue-400" /> : <Shield className="w-4 h-4 text-purple-400" />}
                      </div>
                      <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                        {domain === "ai" ? "Artificial Intelligence" : "Cybersecurity"} Internship
                      </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                      Ready to build, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">{user.name.split(" ")[0]}?</span>
                    </h1>
                    <p className="text-gray-400 text-sm font-medium">Day {currentDay} of {totalDays} · {quotes[quoteIdx]}</p>
                  </div>

                  <div className="flex gap-3">
                    <div className="bg-white/[0.03] border border-white/5 p-4 rounded-xl text-center min-w-[90px]">
                      <p className="text-2xl font-black text-orange-400 flex items-center justify-center gap-1">
                        <Flame className="w-5 h-5" /> {streak}
                      </p>
                      <p className="text-[9px] text-gray-500 uppercase font-bold mt-1 tracking-wider">Streak</p>
                    </div>
                    <div className="bg-white/[0.03] border border-white/5 p-4 rounded-xl text-center min-w-[90px]">
                      <p className="text-2xl font-black text-yellow-400 flex items-center justify-center gap-1">
                        <Star className="w-5 h-5" /> {xp}
                      </p>
                      <p className="text-[9px] text-gray-500 uppercase font-bold mt-1 tracking-wider">XP</p>
                    </div>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
              </motion.div>

              {/* Daily Content Hub */}
              <div className="h-[500px]">
                <DailyContentHub 
                  domain={domain} 
                  day={currentDay} 
                  contentData={currentDayData}
                  user={user}
                  courseId={courseData?._id}
                  action={action}
                />
              </div>

              {/* XP & Streak Section */}
              <HomeProgressSection user={user} domain={domain} />
            </div>

            {/* Right Column: Live Class & Quick Stats (4 cols) */}
            <div className="lg:col-span-4 space-y-8">
              <LiveClassCard domain={domain} day={liveClassDay} />
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                <h3 className="text-white font-extrabold text-sm mb-5 flex items-center gap-2 uppercase tracking-wider">
                  <BarChart3 className="w-4 h-4 text-green-400" /> Mastery Progress
                </h3>
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Course Progress</span>
                      <span className="text-base font-black text-white">{Math.round((currentDay/totalDays)*100)}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(currentDay/totalDays)*100}%` }}
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">XP to Level {level + 1}</span>
                      <span className="text-base font-black text-white">{xp} / {level * 200}</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(xp / (level * 200)) * 100}%` }}
                        className="h-full bg-gradient-to-r from-yellow-500 to-orange-400 rounded-full" />
                    </div>
                  </div>
                </div>
              </motion.div>
              <div className="space-y-2">
                <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em] ml-1 mb-3">Quick Actions</p>
                {[
                  { label: "Join Internship WhatsApp Community", icon: Calendar, color: "text-green-400", url: "#" },
                  { label: "Join Course Specific WhatsApp Group", icon: Trophy, color: "text-blue-400", url: "#" },
                  { label: "View Achievement Gallery", icon: Award, color: "text-yellow-400", url: "?tab=achievements" },
                ].map((actionItem, i) => (
                  <button key={i} onClick={() => { if (actionItem.url) window.location.href = actionItem.url; }} className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all text-left">
                    <actionItem.icon className={`w-4 h-4 ${actionItem.color} flex-shrink-0`} />
                    <span className="text-xs font-bold text-gray-300">{actionItem.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── PROGRESS TAB ── */}
        {tab === "progress" && (
          <ProgressAnalyticsTab user={user} courseData={courseData} domain={domain} />
        )}

        {/* ── ASSIGNMENTS TAB ── */}
        {tab === "assignments" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white">Project Assignments</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { week: "Week 1", title: domain === "ai" ? "Neural Classifier Lab" : "Network Traffic Audit", due: "Sunday", status: "pending" },
                { week: "Week 2", title: domain === "ai" ? "Sentiment Analysis API" : "SQL Injection Prevention", due: "May 24", status: "locked" },
                { week: "Week 3", title: domain === "ai" ? "Recommendation Engine" : "Credential Stuffing Defense", due: "May 31", status: "locked" },
              ].map((a, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className={`relative bg-white/5 border rounded-[2rem] p-8 ${a.status === "locked" ? "opacity-40 grayscale" : "border-white/10"}`}>
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-white/5 rounded-full text-gray-400">
                      {a.week}
                    </span>
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${a.status === "pending" ? "bg-yellow-500/20 text-yellow-500" : "bg-white/5 text-gray-500"}`}>
                      {a.status === "pending" ? "⏳ Pending" : "🔒 Locked"}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{a.title}</h3>
                  <p className="text-gray-500 text-sm flex items-center gap-2 mb-6"><Calendar className="w-4 h-4" /> Due {a.due}</p>
                  
                  {a.status === "pending" && (
                    <button className="w-full py-4 bg-[#7c3aed] text-white font-bold rounded-2xl hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all">
                      Submit Assignment
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ── ACHIEVEMENTS TAB ── */}
        {tab === "achievements" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Achievements</h2>
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-bold">{earnedBadges.length}/{allBadges.length} Unlocked</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {allBadges.map((badge, i) => {
                const earned = earnedBadges.includes(badge.id);
                return (
                  <motion.div key={badge.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }}
                    className={`relative p-6 rounded-3xl border text-center transition-all ${earned ? "bg-gradient-to-br from-[#7c3aed]/20 to-[#00d4ff]/10 border-[#7c3aed]/50" : "bg-white/3 border-white/5 opacity-50"}`}>
                    <div className={`text-5xl mb-3 ${!earned ? "grayscale" : ""}`}>{badge.icon}</div>
                    <p className="text-white font-bold text-sm mb-1">{badge.label}</p>
                    <p className="text-gray-500 text-xs">{badge.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── LEARN TAB ── */}
        {tab === "learn" && (
          <LearningModules user={user} courseData={courseData} domain={domain} />
        )}
      </div>
    </div>
  );
}
