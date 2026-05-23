"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock, CheckCircle, AlertCircle, ArrowRight,
  PlayCircle, CalendarClock, Shield, Brain, Loader2
} from "lucide-react";

type Phase = "lobby" | "schedule" | "test" | "result";

// ── Wrapper that adds the required Suspense boundary for useSearchParams ──
export default function TestPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a1a] flex flex-col items-center justify-center text-white gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-[#00d4ff]" />
        <p className="text-gray-400">Loading quiz...</p>
      </div>
    }>
      <TestPageContent />
    </Suspense>
  );
}

function TestPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const autoStart = searchParams.get("start") === "true";
  const quizId = searchParams.get("quizId");

  const [phase, setPhase] = useState<Phase>("lobby");
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState(1200); // 20 min
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleSuccess, setScheduleSuccess] = useState(false);
  const [questionsLoading, setQuestionsLoading] = useState(false);

  // Define startTest BEFORE the effect that uses it
  const startTest = useCallback(async () => {
    setQuestionsLoading(true);
    try {
      const url = quizId
        ? `/api/test/questions?quizId=${quizId}`
        : "/api/test/questions";
      const res = await fetch(url);
      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setPhase("test");
      } else {
        console.error("No questions returned from API");
      }
    } catch (e) {
      console.error("Failed to fetch questions:", e);
    } finally {
      setQuestionsLoading(false);
    }
  }, [quizId]);

  // Auto-start when coming from dashboard "Start Quiz" button
  useEffect(() => {
    if (autoStart) {
      startTest();
    }
  }, [autoStart, startTest]);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/test/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: answers.filter((a) => a) }),
      });
      const data = await res.json();
      setResult(data);
      setPhase("result");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, answers]);

  // Countdown timer — only runs when test is active
  useEffect(() => {
    if (phase !== "test") return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [phase, timeLeft, handleSubmit]);

  const handleSelect = (optionIdx: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIdx] = {
      questionId: questions[currentIdx]._id,
      selectedOption: optionIdx,
    };
    setAnswers(newAnswers);
  };

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setScheduleLoading(true);
    try {
      await fetch("/api/test/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scheduledDate: scheduleDate }),
      });
      setScheduleSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setScheduleLoading(false);
    }
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  // ─── LOADING (only shown after startTest has been called) ─────────────
  if (questionsLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex flex-col items-center justify-center text-white gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-[#00d4ff]" />
        <p className="text-gray-400">Loading questions...</p>
      </div>
    );
  }

  // ─── LOBBY ───────────────────────────────────────────
  if (phase === "lobby") {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center p-4 pt-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(124,58,237,0.1)_0%,_transparent_70%)]" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full relative z-10"
        >
          <div className="text-center mb-10">
            <div className="flex justify-center gap-4 mb-6">
              <Brain className="w-10 h-10 text-[#00d4ff]" />
              <Shield className="w-10 h-10 text-[#7c3aed]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              {quizId ? "Daily Quiz" : "Eligibility Test"}
            </h1>
            <p className="text-gray-400 text-lg max-w-lg mx-auto">
              {quizId
                ? "Test your knowledge from today's learning. All questions must be answered before submission."
                : <>This is a short test with <strong className="text-white">20 basic computer questions</strong>. You need to score <strong className="text-[#00d4ff]">30% or more</strong> to qualify for the internship.</>
              }
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-10 text-center">
            {[
              { label: "Questions", value: "20" },
              { label: "Time Limit", value: "20 min" },
              { label: quizId ? "Must Answer" : "Passing Score", value: quizId ? "All" : "30%" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="text-3xl font-bold text-[#00d4ff]">{stat.value}</div>
                <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={startTest}
              disabled={questionsLoading}
              className="flex flex-col items-center justify-center gap-3 p-8 bg-gradient-to-br from-[#7c3aed] to-[#6d28d9] rounded-2xl text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(124,58,237,0.4)] transition-all disabled:opacity-50"
            >
              {questionsLoading ? <Loader2 className="w-10 h-10 animate-spin" /> : <PlayCircle className="w-10 h-10" />}
              <span>{questionsLoading ? "Loading..." : "Start Now"}</span>
              <span className="text-sm font-normal text-purple-300">Begin immediately</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setPhase("schedule")}
              className="flex flex-col items-center justify-center gap-3 p-8 bg-white/5 border border-white/10 rounded-2xl text-white font-bold text-lg hover:bg-white/10 transition-all"
            >
              <CalendarClock className="w-10 h-10 text-[#00d4ff]" />
              <span>Schedule for Later</span>
              <span className="text-sm font-normal text-gray-400">Get a link via email</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── SCHEDULE ────────────────────────────────────────
  if (phase === "schedule") {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center p-4 pt-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8"
        >
          {!scheduleSuccess ? (
            <>
              <CalendarClock className="w-12 h-12 text-[#00d4ff] mb-4" />
              <h2 className="text-3xl font-bold text-white mb-2">Schedule Your Test</h2>
              <p className="text-gray-400 mb-8">
                Pick a date &amp; time and we'll send you a personalized test link to your registered email.
              </p>
              <form onSubmit={handleSchedule} className="space-y-5">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Choose Date &amp; Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={scheduleDate}
                    min={new Date().toISOString().slice(0, 16)}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full bg-[#0a0a1a] border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#7c3aed] transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={scheduleLoading}
                  className="w-full py-4 bg-[#00d4ff] text-[#0a0a1a] font-bold rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-all disabled:opacity-50"
                >
                  {scheduleLoading ? <Loader2 className="animate-spin w-5 h-5" /> : "Confirm & Send Email"}
                </button>
                <button
                  type="button"
                  onClick={() => setPhase("lobby")}
                  className="w-full py-3 text-gray-400 hover:text-white transition-colors text-sm"
                >
                  ← Back
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-3">Test Scheduled!</h2>
              <p className="text-gray-400 mb-6">
                A confirmation email with your test link has been sent to your registered email address.
              </p>
              <button
                onClick={() => router.push("/")}
                className="px-8 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all"
              >
                Back to Home
              </button>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  // ─── RESULT ──────────────────────────────────────────
  if (phase === "result" && result) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-3xl text-center"
        >
          {result.status === "passed" ? (
            <>
              <div className="w-24 h-24 rounded-full bg-[#00d4ff]/10 border-2 border-[#00d4ff] flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-[#00d4ff]" />
              </div>
              <h2 className="text-4xl font-extrabold text-white mb-2">You Passed! 🎉</h2>
              <p className="text-gray-400 mb-2">
                Score: <span className="text-white font-bold">{result.score}/{result.total}</span>
              </p>
              <p className="text-[#00d4ff] text-3xl font-bold mb-6">{result.percentage}%</p>
              <p className="text-gray-400 mb-8">
                Congratulations! You've cleared the eligibility test. A confirmation email has been sent to you.
                Now choose your internship plan to get started!
              </p>
              <button
                onClick={() => router.push("/select-course")}
                className="w-full py-4 bg-[#7c3aed] text-white rounded-xl font-bold hover:shadow-[0_0_25px_rgba(124,58,237,0.4)] transition-all flex items-center justify-center gap-2"
              >
                Choose Your Plan <ArrowRight className="w-5 h-5" />
              </button>
            </>
          ) : (
            <>
              <div className="w-24 h-24 rounded-full bg-red-500/10 border-2 border-red-500 flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-12 h-12 text-red-500" />
              </div>
              <h2 className="text-4xl font-extrabold text-white mb-2">Not Quite!</h2>
              <p className="text-gray-400 mb-2">
                Score: <span className="text-white font-bold">{result.score}/{result.total}</span>
              </p>
              <p className="text-red-400 text-3xl font-bold mb-6">{result.percentage}%</p>
              <p className="text-gray-400 mb-8">
                You need at least <strong className="text-white">30%</strong> to qualify. Don't worry — review the basics and try again!
              </p>
              <button
                onClick={() => { setPhase("lobby"); setResult(null); setAnswers([]); setCurrentIdx(0); setTimeLeft(1200); }}
                className="w-full py-4 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-all"
              >
                Try Again
              </button>
            </>
          )}
        </motion.div>
      </div>
    );
  }

  // ─── TEST ─────────────────────────────────────────────
  if (phase !== "test" || questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex flex-col items-center justify-center text-white gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-[#00d4ff]" />
        <p className="text-gray-400">Loading questions...</p>
      </div>
    );
  }

  const currentQ = questions[currentIdx];
  const answeredCount = answers.filter((a) => a).length;

  return (
    <div className="min-h-screen bg-[#0a0a1a] pt-24 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 bg-white/5 border border-white/10 p-5 rounded-2xl">
          <div>
            <h1 className="text-lg font-bold text-white">{quizId ? "Daily Quiz" : "Eligibility Test"}</h1>
            <p className="text-gray-400 text-sm">
              Question {currentIdx + 1} of {questions.length} · {answeredCount} answered
            </p>
          </div>
          <div className={`flex items-center gap-2 font-mono text-2xl font-bold ${timeLeft < 120 ? "text-red-400" : "text-[#00d4ff]"}`}>
            <Clock className="w-6 h-6" /> {formatTime(timeLeft)}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-white/10 rounded-full mb-8">
          <div
            className="h-1.5 bg-gradient-to-r from-[#7c3aed] to-[#00d4ff] rounded-full transition-all duration-300"
            style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.2 }}
            className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-3xl mb-6"
          >
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">
              {currentQ.category === "ai" ? "🤖 AI & Tech" : currentQ.category === "cybersecurity" ? "🔐 Cybersecurity" : "💡 General Computer Knowledge"}
            </p>
            <h2 className="text-xl md:text-2xl text-white font-semibold mb-8">{currentQ.question}</h2>
            <div className="grid gap-3">
              {currentQ.options.map((opt: string, i: number) => (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${answers[currentIdx]?.selectedOption === i
                    ? "bg-[#7c3aed]/20 border-[#7c3aed] text-[#a78bfa]"
                    : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20"
                    }`}
                >
                  <span className={`w-8 h-8 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-sm font-bold ${answers[currentIdx]?.selectedOption === i ? "border-[#7c3aed] text-[#7c3aed]" : "border-white/20"
                    }`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span>{opt}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx((prev) => prev - 1)}
            className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl disabled:opacity-30 hover:bg-white/10 transition-all"
          >
            ← Previous
          </button>
          {currentIdx === questions.length - 1 ? (
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {answeredCount < questions.length && (
                <span className="text-amber-400 text-xs font-semibold flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-lg">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> Answer all {questions.length} questions ({questions.length - answeredCount} remaining)
                </span>
              )}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || answeredCount < questions.length}
                className="px-10 py-3 bg-[#00d4ff] text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? <><Loader2 className="animate-spin w-4 h-4" /> Submitting...</> : "Submit Test ✓"}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setCurrentIdx((prev) => prev + 1)}
              className="px-8 py-3 bg-[#7c3aed] text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all flex items-center gap-2"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
