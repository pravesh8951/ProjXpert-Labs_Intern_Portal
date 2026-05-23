"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Lock, Star } from "lucide-react";

interface RoadmapModule {
  week: number;
  title: string;
  topics: string[];
  tools: string[];
  assignment: string;
  miniProject: string;
}

interface RoadmapViewerProps {
  roadmap: RoadmapModule[];
  selectedDuration: number; // 1, 2, or 3
}

const RoadmapViewer: React.FC<RoadmapViewerProps> = ({ roadmap, selectedDuration }) => {
  const maxWeek = selectedDuration * 4;

  return (
    <div className="py-12 px-4 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-4">
          Internship <span className="text-cyan-400">Roadmap</span>
        </h2>
        <p className="text-slate-400">
          A structured path from foundations to advanced security research.
        </p>
      </div>

      <div className="relative border-l-2 border-slate-800 ml-4 md:ml-8 space-y-12 pb-12">
        {roadmap.map((module, index) => {
          const isLocked = module.week > maxWeek;
          const isNextLevel = module.week === maxWeek + 1;

          return (
            <motion.div
              key={module.week}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative pl-8 md:pl-12 ${isLocked ? "opacity-50" : "opacity-100"}`}
            >
              {/* Dot on the timeline */}
              <div
                className={`absolute -left-[11px] top-0 w-5 h-5 rounded-full border-4 border-slate-900 ${isLocked ? "bg-slate-700" : "bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                  }`}
              />

              {/* Month Header */}
              {module.week % 4 === 1 && (
                <div className="absolute -left-12 top-0 -translate-x-full hidden md:block">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Month {Math.ceil(module.week / 4)}
                  </span>
                </div>
              )}

              <div
                className={`p-6 rounded-2xl border transition-all duration-300 ${isLocked
                  ? "bg-slate-900/50 border-slate-800 grayscale"
                  : "bg-slate-900 border-slate-800 hover:border-cyan-500/50"
                  }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-cyan-400 font-mono text-sm font-bold uppercase tracking-tighter">
                      Week {module.week}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-1">{module.title}</h3>
                  </div>
                  {isLocked ? (
                    <div className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full text-xs text-slate-400">
                      <Lock size={12} />
                      Upgrade Required
                    </div>
                  ) : (
                    <div className="bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full text-xs font-bold">
                      Included
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-300 mb-2">Core Topics</h4>
                    <ul className="space-y-1">
                      {module.topics.map((topic) => (
                        <li key={topic} className="text-sm text-slate-400 flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-cyan-500" />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-slate-300 mb-2">Hands-on Work</h4>
                    <div className="space-y-3">
                      <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          Assignment
                        </span>
                        <p className="text-sm text-slate-300">{module.assignment}</p>
                      </div>
                      <div className="bg-cyan-500/5 p-3 rounded-lg border border-cyan-500/10">
                        <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                          Mini Project
                        </span>
                        <p className="text-sm text-slate-200 font-medium">{module.miniProject}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {!isLocked && (
                  <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap gap-2">
                    {module.tools.map((tool) => (
                      <span
                        key={tool}
                        className="px-2 py-1 bg-slate-800 text-slate-400 text-[10px] font-mono rounded"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default RoadmapViewer;
