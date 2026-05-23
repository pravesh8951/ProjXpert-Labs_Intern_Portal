"use client";

import { motion } from "framer-motion";
import { 
  Video, FolderKanban, Users, Award, 
  Map, Headphones, ClipboardList, Briefcase, Calendar, ChevronRight, Play, Sparkles
} from "lucide-react";

export default function FeaturesSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section id="features" className="py-28 relative overflow-hidden bg-[var(--background)] border-t border-[var(--nav-border)] transition-colors duration-300">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs font-semibold uppercase tracking-wider mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Platform Features</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold text-[var(--text-primary)] mb-5 tracking-tight"
          >
            Engineered For <span className="text-gradient">Real Learning</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[var(--text-secondary)] text-md md:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            A cohesive environment designed to take you from writing your first line of code to deploying enterprise systems.
          </motion.p>
        </div>

        {/* Bento Grid Layout */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
        >
          
          {/* Card 1: Daily Live Classes (Double Width) */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-2 p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full group-hover:bg-blue-500/15 transition-colors" />
            
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 text-blue-400">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Live Classes Daily at 8 PM IST</h3>
              <p className="text-gray-400 text-sm max-w-md leading-relaxed">
                Connect live with engineering leaders. Learn core architecture, participate in design critiques, and ask questions in real-time Q&A.
              </p>
            </div>

            {/* Simulated Live Widget Graphics */}
            <div className="mt-8 bg-[#0b0b1a] border border-white/5 rounded-xl p-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
                <span className="text-[11px] font-mono text-gray-400">Active Session: System Design basics</span>
              </div>
              <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-[10px] font-bold flex items-center gap-1 hover:bg-blue-500 transition-colors">
                <Play className="w-3 h-3 fill-current" /> Join Class
              </button>
            </div>
          </motion.div>

          {/* Card 2: Mentor Support (Single Width) */}
          <motion.div
            variants={itemVariants}
            className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6 text-purple-400">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">1:1 Mentor Support</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Stuck on a bug or model convergence issue? Get direct help from our team of dedicated teaching assistants through chat and meeting support.
              </p>
            </div>
            
            <div className="mt-8 text-xs text-purple-400 font-semibold flex items-center gap-1">
              <span>Connect with a mentor</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </motion.div>

          {/* Card 3: Daily Learning Path (Single Width) */}
          <motion.div
            variants={itemVariants}
            className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-6 text-green-400">
                <Map className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Structured Daily Paths</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                We break complex milestones down to simple, achievable daily sprints. Follow your roadmap step by step without overwhelm.
              </p>
            </div>
            
            <div className="mt-8 text-xs text-green-400 font-semibold flex items-center gap-1">
              <span>View roadmaps</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </motion.div>

          {/* Card 4: Real-world Projects (Double Width) */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-2 p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 blur-[80px] rounded-full group-hover:bg-green-500/15 transition-colors" />
            
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-6 text-orange-400">
                <FolderKanban className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Deploy Portfolio Projects</h3>
              <p className="text-gray-400 text-sm max-w-md leading-relaxed">
                Build real production systems (like AI models, secured servers, log aggregators). Document your architectural decisions to stand out during job search processes.
              </p>
            </div>

            {/* Mini Project Graphic */}
            <div className="mt-8 border border-white/5 bg-[#0b0b1a] rounded-xl p-4 z-10 flex gap-4 font-mono text-[10px] text-gray-500">
              <div className="flex-1 border-r border-white/5 pr-4">
                <p className="text-white font-bold mb-1">PROJ-01: API Defense</p>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-1.5">
                  <div className="bg-orange-500 w-3/4 h-full" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-white font-bold mb-1">PROJ-02: LLM Agent</p>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-1.5">
                  <div className="bg-blue-500 w-1/2 h-full" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 5: Audio Learning */}
          <motion.div
            variants={itemVariants}
            className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-300 group flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 flex-shrink-0 group-hover:scale-105 transition-transform">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white mb-1 text-sm">Audio Summaries</h4>
              <p className="text-gray-400 text-xs leading-relaxed">Listen to high-quality audio summaries of key concepts while on the go.</p>
            </div>
          </motion.div>

          {/* Card 6: Quizzes & Practice */}
          <motion.div
            variants={itemVariants}
            className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-300 group flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 flex-shrink-0 group-hover:scale-105 transition-transform">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white mb-1 text-sm">Interactive Labs</h4>
              <p className="text-gray-400 text-xs leading-relaxed">Daily assignments and hands-on quizzes to validate your practical skills.</p>
            </div>
          </motion.div>

          {/* Card 7: Placement Guidance */}
          <motion.div
            variants={itemVariants}
            className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-300 group flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0 group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white mb-1 text-sm">Career Planning</h4>
              <p className="text-gray-400 text-xs leading-relaxed">1-on-1 resume reviews, mock interviews, and direct referral partner channels.</p>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
