"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, HelpCircle, Headphones, CheckCircle,
  Play, Pause, Square, X, ChevronRight, Clock, Star, Zap, Hourglass, CircleDashed,
  Loader2, ArrowRight, AlertCircle
} from "lucide-react";

export default function DailyContentHub({
  domain,
  day,
  contentData,
}: {
  domain: string;
  day: number;
  contentData?: any;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"reading" | "quiz" | "audio">("reading");
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Quiz state
  const [quizPhase, setQuizPhase] = useState<"lobby" | "test" | "result">("lobby");
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [questionsLoading, setQuestionsLoading] = useState(false);

  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>("");

  const tabs = [
    { id: "reading", label: "Reading", icon: BookOpen },
    { id: "quiz",    label: "Quiz",    icon: HelpCircle },
    { id: "audio",   label: "Audio",   icon: Headphones },
  ];

  const readingTitle =
    contentData?.title ||
    (domain === "ai" ? "Neural Network Fundamentals" : "Web Security Architecture");
  const theoryText =
    contentData?.content?.theory || "Loading today's content...";
  const keyPoints = contentData?.content?.keyPoints || [];

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      
      // Filter English voices
      let englishVoices = availableVoices.filter(v => v.lang.startsWith('en'));
      
      // Fallback if no English voices are found
      if (englishVoices.length === 0) {
        englishVoices = availableVoices;
      }

      // Keep only up to 5 voices
      const filteredVoices = englishVoices.slice(0, 5);
      
      setVoices(filteredVoices);
      if (filteredVoices.length > 0) {
        // Set default voice if none selected
        setSelectedVoiceURI(prev => {
          if (prev && filteredVoices.some(v => v.voiceURI === prev)) return prev;
          const defaultVoice = filteredVoices.find(v => v.name.includes('Natural') || v.name.includes('Google')) || filteredVoices[0];
          return defaultVoice.voiceURI;
        });
      }
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Cleanup on unmount
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleAudio = () => {
    if (!window.speechSynthesis) return;

    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPlaying(true);
      } else {
        // Start fresh
        window.speechSynthesis.cancel();
        
        let textToRead = `${readingTitle}. `;
        if (keyPoints && keyPoints.length > 0) {
          textToRead += `Here are the key takeaways: ${keyPoints.join(". ")}.`;
        } else {
          // Fallback if no key points are provided
          textToRead += "There are no key takeaways available for this summary.";
        }

        const utterance = new SpeechSynthesisUtterance(textToRead);
        
        if (selectedVoiceURI) {
          const selectedVoice = voices.find(v => v.voiceURI === selectedVoiceURI);
          if (selectedVoice) {
            utterance.voice = selectedVoice;
          }
        }
        
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        
        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
      }
    }
  };

  const startTest = async () => {
    setIsQuizOpen(true);
    setQuestionsLoading(true);
    try {
      const courseId = domain === "ai" ? "6a0f5b3d18618bb44fae456c" : "6a0f596a18618bb44fae456b";
      const url = `/api/courses/daily-quiz?courseId=${courseId}&day=${day}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setQuizPhase("test");
        setCurrentIdx(0);
        setAnswers([]);
        setResult(null);
      } else {
        console.error("No questions returned from API");
        // Fallback fake question so UI doesn't break if API fails
        setQuestions([{
            question: "No quiz data found for today. Please check back later.",
            options: ["Okay"],
            answer: "Okay"
        }]);
        setQuizPhase("test");
        setCurrentIdx(0);
        setAnswers([]);
        setResult(null);
      }
    } catch (e) {
      console.error("Failed to fetch questions:", e);
    } finally {
      setQuestionsLoading(false);
    }
  };

  const handleSelect = (optionIdx: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIdx] = {
      selectedOption: optionIdx,
    };
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      let correct = 0;
      answers.forEach((ans, i) => {
        if (!ans) return;
        const q = questions[i];
        const selectedText = q.options[ans.selectedOption];
        if (selectedText === q.answer) {
          correct++;
        }
      });
      
      const percentage = Math.round((correct / questions.length) * 100);
      const isPassed = percentage >= 60;
      
      setResult({
        score: correct,
        total: questions.length,
        percentage,
        status: isPassed ? "passed" : "failed"
      });
      setQuizPhase("result");

      // Save to backend
      await fetch("/api/user/daily-quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          day: day,
          score: correct,
          total: questions.length,
          passed: isPassed
        }),
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="card overflow-hidden flex flex-col h-full bg-[#0d0f22]/90 border border-white/5">
        {/* Tab bar */}
        <div className="flex border-b border-white/5 bg-[#0a0a1a]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-xs font-bold uppercase tracking-wider transition-all relative ${
                activeTab === tab.id
                  ? "text-blue-400 bg-white/[0.02] border-b-2 border-blue-500"
                  : "text-gray-400 hover:text-white hover:bg-white/[0.02]"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Daily Checklist UI */}
        <div className="bg-white/[0.01] border-b border-white/5 px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2 text-green-400 text-xs font-bold">
            <CheckCircle className="w-3.5 h-3.5" /> Read content <span className="text-[9px] text-green-500/50">+20 XP</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2 text-gray-400 text-xs font-bold">
            <CircleDashed className="w-3.5 h-3.5" /> Attempt quiz <span className="text-[9px] text-gray-500">+30 XP</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2 text-yellow-500 text-xs font-bold">
            <Hourglass className="w-3.5 h-3.5" /> Submit assignment <span className="text-[9px] text-yellow-500/50">+50 XP</span>
          </div>
        </div>

        {/* Content area */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          <AnimatePresence mode="wait">

            {/* READING */}
            {activeTab === "reading" && (
              <motion.div
                key="reading"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col h-full justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
                      DAY {day}
                    </span>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-white/5 text-gray-400 border border-white/5 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> 12 min
                    </span>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 flex items-center gap-1">
                      <Star className="w-3 h-3" /> 20 XP
                    </span>
                  </div>
                  
                  <h4 className="text-white font-extrabold text-lg leading-snug line-clamp-1 mb-3">
                    {readingTitle}
                  </h4>

                  {/* Preview card */}
                  <div className="relative bg-white/[0.02] border border-white/5 rounded-xl p-5 overflow-hidden h-[180px]">
                    <p className="text-gray-300 text-sm leading-relaxed line-clamp-4">
                      {theoryText}
                    </p>
                    {/* Fade overlay + CTA */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e0f22] via-[#0e0f22]/70 to-transparent flex items-end justify-center pb-5">
                      <button
                        onClick={() => setIsReaderOpen(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-blue-600/15 group"
                      >
                        Open Reader
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-auto">
                  {isCompleted ? (
                    <div className="flex items-center gap-2 py-2.5 px-4 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold rounded-lg">
                      <CheckCircle className="w-4 h-4" /> Reading completed!
                    </div>
                  ) : (
                    <div className="text-center text-xs text-gray-500 font-medium">
                      Complete today's reading to unlock the quiz module.
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* QUIZ (Inline Lobby Only) */}
            {activeTab === "quiz" && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col h-full justify-center items-center py-10 gap-4"
              >
                <div className="w-14 h-14 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <HelpCircle className="w-7 h-7" />
                </div>
                <div className="text-center">
                  <h4 className="text-white font-extrabold text-lg mb-1">Daily Quiz</h4>
                  <p className="text-gray-400 text-sm">Test your knowledge from today's reading</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 font-mono">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> ~5 min</span>
                  <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-yellow-500" /> 30 XP</span>
                </div>
                <button
                  onClick={startTest}
                  className="mt-2 px-8 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-purple-600/15 flex items-center gap-2"
                >
                  Start Daily Quiz
                </button>
              </motion.div>
            )}

            {/* AUDIO */}
            {activeTab === "audio" && (
              <motion.div 
                key="audio" 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="py-4 flex flex-col justify-center h-full"
              >
                <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 rounded-xl p-5">
                  <button 
                    onClick={toggleAudio}
                    className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg transition-all flex-shrink-0"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 fill-current" />
                    ) : (
                      <Play className="w-5 h-5 ml-0.5 fill-current" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-bold text-sm">Day {day} Audio Digest</h4>
                    <p className="text-gray-400 text-xs mt-0.5 font-mono mb-2">
                      {isPlaying ? "Playing summary..." : "Title & Key Takeaways"}
                    </p>
                    
                    {voices.length > 0 && (
                      <div className="relative inline-block w-full max-w-[220px]">
                        <select 
                          value={selectedVoiceURI} 
                          onChange={(e) => {
                            setSelectedVoiceURI(e.target.value);
                            if (isPlaying) {
                              window.speechSynthesis.cancel();
                              setIsPlaying(false);
                            }
                          }}
                          className="w-full bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-blue-500/50 text-gray-200 text-xs font-semibold rounded-lg py-2 px-3 outline-none focus:ring-1 focus:ring-blue-500/50 transition-all cursor-pointer appearance-none pr-8 shadow-inner shadow-black/40"
                        >
                          {voices.map(voice => {
                            // Extract clean voice name
                            let cleanName = voice.name
                              .replace(/(Microsoft|Google|Apple|Desktop|Natural|Voice)/gi, "")
                              .replace(/\s\s+/g, " ")
                              .trim();
                            return (
                              <option key={voice.voiceURI} value={voice.voiceURI} className="bg-[#0d0f22] text-gray-200 py-2">
                                🗣️  {cleanName || voice.name}
                              </option>
                            );
                          })}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-400">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                          </svg>
                        </div>
                      </div>
                    )}

                    {/* Waveform graphic */}
                    <div className="flex items-center gap-0.5 mt-3 h-5">
                      {Array.from({ length: 32 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-1 bg-blue-500/35 rounded-full transition-all duration-300 ${isPlaying ? 'animate-pulse bg-blue-400' : ''}`}
                          style={{ height: `${6 + Math.sin(i * 0.8) * 6 + Math.random() * 4}px` }}
                        />
                      ))}
                    </div>
                  </div>
                  {isPlaying && (
                    <button 
                      onClick={() => {
                        window.speechSynthesis.cancel();
                        setIsPlaying(false);
                      }}
                      className="w-8 h-8 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-400 flex items-center justify-center transition-all ml-2"
                      title="Stop Audio"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" />
                    </button>
                  )}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* ── FULL READER MODAL ── */}
      <AnimatePresence>
        {isReaderOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#070714] flex flex-col"
          >
            {/* Sticky top bar */}
            <div className="px-6 lg:px-10 py-4 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#0d0f22]/95 backdrop-blur-sm z-20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20 text-blue-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-white font-extrabold text-base">{readingTitle}</h5>
                  <p className="text-gray-400 text-xs font-mono">Module {Math.ceil(day / 7)} · Day {day}</p>
                </div>
              </div>
              <button
                onClick={() => setIsReaderOpen(false)}
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
                    <span className="px-3 py-1 rounded-lg text-[11px] font-extrabold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
                      DAY {day}
                    </span>
                    <span className="px-3 py-1 rounded-lg text-[11px] font-bold bg-white/5 text-gray-400 border border-white/5 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> 12 min read
                    </span>
                    <span className="px-3 py-1 rounded-lg text-[11px] font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5" /> 20 XP
                    </span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight tracking-tight">
                    {readingTitle}
                  </h1>
                  <div className="h-px bg-gradient-to-r from-blue-500/30 via-purple-500/20 to-transparent" />
                </header>

                {/* ── Theory / Main Content ── */}
                <article className="prose-custom">
                  <div className="text-gray-300 text-[16px] sm:text-[17px] leading-[1.9] whitespace-pre-wrap tracking-wide font-normal">
                    {theoryText}
                  </div>
                </article>

                {/* ── Key Takeaways ── */}
                {keyPoints.length > 0 && (
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
                      {keyPoints.map((point: string, idx: number) => (
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

                {/* ── Deep Dive ── */}
                {contentData?.content?.deepDive && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-purple-500/[0.04] border border-purple-500/15 rounded-2xl p-7 sm:p-8"
                  >
                    <div className="flex items-center gap-2.5 mb-4">
                      <div className="p-1.5 rounded-lg bg-purple-500/15 border border-purple-500/25">
                        <Zap className="w-5 h-5 text-purple-400" />
                      </div>
                      <p className="text-sm font-extrabold text-purple-400 uppercase tracking-wider">Deep Dive Insight</p>
                    </div>
                    <p className="text-gray-300 leading-[1.85] text-[15px]">{contentData.content.deepDive}</p>
                  </motion.div>
                )}

                {/* ── Real World Example ── */}
                {contentData?.content?.realWorldExample && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <h2 className="text-xl sm:text-2xl font-black text-white mb-4 flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-yellow-500/15 border border-yellow-500/25">
                        <Star className="w-5 h-5 text-yellow-400" />
                      </div>
                      Real-World Case Study
                    </h2>
                    <div className="bg-yellow-500/[0.04] border border-yellow-500/10 rounded-2xl p-7 sm:p-8">
                      <p className="text-gray-300 text-[15px] leading-[1.85]">{contentData.content.realWorldExample}</p>
                    </div>
                  </motion.div>
                )}

                {/* ── Complete button ── */}
                <div className="pb-10 pt-4">
                  {!isCompleted ? (
                    <button
                      onClick={() => {
                        setIsCompleted(true);
                        setTimeout(() => setIsReaderOpen(false), 1200);
                      }}
                      className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-base rounded-xl transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 group"
                    >
                      <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" /> Complete Lesson & Earn 20 XP
                    </button>
                  ) : (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-full py-4 bg-green-500/10 border border-green-500/20 text-green-400 font-bold text-base rounded-xl flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" /> Lesson Complete! +20 XP
                    </motion.div>
                  )}
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

      {/* ── FULL QUIZ MODAL ── */}
      <AnimatePresence>
        {isQuizOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#070714] flex flex-col"
          >
            {/* Sticky top bar */}
            <div className="px-6 lg:px-10 py-4 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#0d0f22]/95 backdrop-blur-sm z-20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/20 text-purple-400">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-white font-extrabold text-base">Daily Quiz: Day {day}</h5>
                  <p className="text-gray-400 text-xs font-mono">{readingTitle}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (quizPhase !== 'result') {
                    if (confirm("Are you sure you want to exit the quiz? Your progress will be lost.")) {
                      setIsQuizOpen(false);
                      setQuizPhase("lobby");
                    }
                  } else {
                    setIsQuizOpen(false);
                    setQuizPhase("lobby");
                  }
                }}
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quiz Content Container */}
            <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center p-6 sm:p-12">
              <div className="w-full max-w-3xl">
                
                {questionsLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
                    <p className="text-gray-400 font-medium">Loading your quiz...</p>
                  </div>
                ) : quizPhase === "test" && questions.length > 0 ? (
                  <div className="flex flex-col">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h4 className="text-white font-extrabold text-lg">Question {currentIdx + 1} of {questions.length}</h4>
                      </div>
                      <div className="px-3 py-1 bg-white/5 rounded-full text-xs text-gray-300 font-medium border border-white/10">
                        {answers.filter(a => a).length} Answered
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-2 bg-white/10 rounded-full mb-8">
                      <div
                        className="h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${((currentIdx) / questions.length) * 100}%` }}
                      />
                    </div>

                    {/* Question Card */}
                    <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 mb-8 shadow-2xl">
                      <h2 className="text-2xl text-white font-bold mb-8 leading-snug">{questions[currentIdx].question}</h2>
                      <div className="grid gap-4">
                        {questions[currentIdx].options.map((opt: string, i: number) => (
                          <button
                            key={i}
                            onClick={() => handleSelect(i)}
                            className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center gap-4 text-base font-medium ${
                              answers[currentIdx]?.selectedOption === i
                                ? "bg-purple-500/20 border-purple-500 text-purple-200 shadow-[0_0_20px_rgba(168,85,247,0.15)]"
                                : "bg-white/5 border-white/5 text-gray-300 hover:bg-white/10 hover:border-white/20"
                            }`}
                          >
                            <span className={`w-8 h-8 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-sm font-extrabold ${
                              answers[currentIdx]?.selectedOption === i ? "border-purple-500 text-purple-400" : "border-white/20 text-gray-500"
                            }`}>
                              {String.fromCharCode(65 + i)}
                            </span>
                            <span>{opt}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between items-center">
                      <button
                        disabled={currentIdx === 0}
                        onClick={() => setCurrentIdx(prev => prev - 1)}
                        className="px-6 py-3 bg-white/5 border border-white/10 text-white text-sm font-bold rounded-xl disabled:opacity-30 hover:bg-white/10 transition-all flex items-center gap-2"
                      >
                        Previous
                      </button>
                      
                      {currentIdx === questions.length - 1 ? (
                        <button
                          onClick={handleSubmit}
                          disabled={isSubmitting || answers.filter(a => a).length < questions.length}
                          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-bold rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Quiz"}
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            if (answers[currentIdx] === undefined) {
                               // Make them answer to proceed if you want, but allowing skip is also fine.
                               // We'll let them skip and come back.
                            }
                            setCurrentIdx(prev => prev + 1);
                          }}
                          className="px-8 py-3 bg-purple-600 text-white text-sm font-bold rounded-xl hover:bg-purple-500 transition-all flex items-center gap-2 shadow-lg shadow-purple-600/20"
                        >
                          Next <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ) : quizPhase === "result" && result ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-6 bg-white/[0.02] border border-white/5 rounded-3xl p-10 text-center shadow-2xl">
                    {result.status === "passed" ? (
                      <>
                        <motion.div 
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="w-24 h-24 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center mb-2 shadow-[0_0_30px_rgba(34,197,94,0.3)]"
                        >
                          <CheckCircle className="w-12 h-12 text-green-400" />
                        </motion.div>
                        <div>
                          <h2 className="text-3xl font-extrabold text-white mb-2">Quiz Passed! 🎉</h2>
                          <p className="text-gray-400 text-lg">Amazing job! You really know your stuff.</p>
                        </div>
                        
                        <div className="bg-[#0a0a1a] border border-white/10 rounded-2xl p-6 w-full max-w-sm my-4">
                          <p className="text-gray-400 text-sm uppercase tracking-wider font-bold mb-2">Final Score</p>
                          <p className="text-4xl font-black text-white">{result.percentage}%</p>
                          <p className="text-gray-500 mt-2">{result.score} out of {result.total} correct</p>
                        </div>
                        
                        <p className="text-sm text-green-400 font-extrabold bg-green-500/10 px-5 py-2.5 rounded-xl border border-green-500/20 shadow-lg shadow-green-500/10 mb-4 flex items-center gap-2">
                           <Zap className="w-4 h-4 fill-current" /> +30 XP Earned
                        </p>
                        <button
                          onClick={() => {
                            setIsQuizOpen(false);
                            setQuizPhase("lobby");
                          }}
                          className="px-10 py-3.5 bg-white text-black hover:bg-gray-200 font-bold rounded-xl transition-all shadow-xl"
                        >
                          Return to Dashboard
                        </button>
                      </>
                    ) : (
                      <>
                        <motion.div 
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="w-24 h-24 rounded-full bg-red-500/10 border-2 border-red-500 flex items-center justify-center mb-2 shadow-[0_0_30px_rgba(239,68,68,0.3)]"
                        >
                          <AlertCircle className="w-12 h-12 text-red-500" />
                        </motion.div>
                        <div>
                          <h2 className="text-3xl font-extrabold text-white mb-2">Keep Learning!</h2>
                          <p className="text-gray-400 text-lg">You didn't quite pass this time.</p>
                        </div>
                        
                        <div className="bg-[#0a0a1a] border border-white/10 rounded-2xl p-6 w-full max-w-sm my-4">
                          <p className="text-gray-400 text-sm uppercase tracking-wider font-bold mb-2">Final Score</p>
                          <p className="text-4xl font-black text-white">{result.percentage}%</p>
                          <p className="text-gray-500 mt-2">{result.score} out of {result.total} correct</p>
                        </div>
                        
                        <p className="text-sm text-gray-400 mb-6 max-w-md">Review today's reading module again to refresh your memory, then give the quiz another try.</p>
                        <div className="flex gap-4">
                          <button
                            onClick={() => {
                               setIsQuizOpen(false);
                               setQuizPhase("lobby");
                               setActiveTab("reading");
                               setIsReaderOpen(true);
                            }}
                            className="px-6 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl transition-all"
                          >
                            Review Material
                          </button>
                          <button
                            onClick={startTest}
                            className="px-8 py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-600/25"
                          >
                            Try Again
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
