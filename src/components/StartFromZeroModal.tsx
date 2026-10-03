import React from 'react';
import { X, CheckCircle2, ArrowRight, Play, BookOpen, Layers } from 'lucide-react';

interface StartFromZeroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartLesson: () => void;
}

export const StartFromZeroModal: React.FC<StartFromZeroModalProps> = ({ isOpen, onClose, onStartLesson }) => {
  if (!isOpen) return null;

  const steps = [
    { title: 'Programming Basics', desc: 'How computers execute commands and logic', active: true },
    { title: 'Variables & State', desc: 'Storing values in memory and naming conventions' },
    { title: 'Data Types', desc: 'Numbers, Strings, Booleans, and Floats' },
    { title: 'Input & Output', desc: 'Reading user input and printing formatted results' },
    { title: 'Conditions (if/else)', desc: 'Branching decisions and boolean comparisons' },
    { title: 'Loops (while/for)', desc: 'Repeating actions and iteration bounds' },
    { title: 'Functions & Scope', desc: 'Reusable blocks, parameters, and return values' },
    { title: 'Lists & Sequences', desc: 'Managing collections, indexing, and slicing' },
    { title: 'Strings Manipulation', desc: 'Searching, replacing, and string parsing' },
    { title: 'Dictionaries & Maps', desc: 'Key-value lookups with average O(1) speed' },
    { title: 'Problem Solving', desc: 'Combining conditions, loops, and data structures' },
    { title: 'Mini Project', desc: 'Build an interactive console budget or to-do manager' },
  ];

  const pedagogy = ['EXPLAIN', 'SHOW', 'TRY', 'PRACTICE', 'TEST', 'APPLY'];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-400 shrink-0">
            <span className="text-2xl">🌱</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
              Zero-Prerequisite Pathway
            </span>
            <h3 className="text-xl font-bold text-white">Starting From Zero</h3>
          </div>
        </div>

        <p className="text-xs text-slate-300 mb-5 leading-relaxed">
          "That's completely okay. We don't assume any prior programming experience. SkillProof AI guides you from the very first concept."
        </p>

        {/* 6-Phase Pedagogical Model */}
        <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 mb-6">
          <span className="text-[10px] uppercase font-bold text-indigo-400 block mb-2">
            Every Lesson Follows Our 6-Step Mastery Sequence:
          </span>
          <div className="flex items-center justify-between text-center gap-1 overflow-x-auto pb-1 font-mono text-[10px] font-bold text-slate-300">
            {pedagogy.map((p, i) => (
              <React.Fragment key={p}>
                <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-indigo-300">
                  {p}
                </span>
                {i < pedagogy.length - 1 && <span className="text-slate-600">→</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Curriculum Sequence */}
        <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Micro-Curriculum Roadmap</h4>
        <div className="space-y-2 mb-6">
          {steps.map((st, i) => (
            <div
              key={i}
              className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                st.active
                  ? 'bg-emerald-950/30 border-emerald-800 text-white font-semibold'
                  : 'bg-slate-950/60 border-slate-800/80 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  st.active ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {i + 1}
                </span>
                <div>
                  <span className={st.active ? 'text-white' : 'text-slate-300'}>{st.title}</span>
                  <span className="text-[10px] text-slate-500 block">{st.desc}</span>
                </div>
              </div>
              {st.active && (
                <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  Current
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
          >
            Close
          </button>
          <button
            onClick={() => {
              onStartLesson();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5" /> Start Lesson 1: Basics
          </button>
        </div>
      </div>
    </div>
  );
};
