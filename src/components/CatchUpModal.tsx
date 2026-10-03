import React from 'react';
import { AlertTriangle, CheckCircle2, ArrowRight, X, Clock, Calendar } from 'lucide-react';

interface CatchUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivate: () => void;
}

export const CatchUpModal: React.FC<CatchUpModalProps> = ({ isOpen, onClose, onActivate }) => {
  if (!isOpen) return null;

  const weeks = [
    { week: 'Week 1', title: 'Programming Basics & Syntax', focus: 'Variables, Conditionals & IO' },
    { week: 'Week 2', title: 'Loops & Modular Functions', focus: 'Iteration, Scope & Return Values' },
    { week: 'Week 3', title: 'Lists, Tuples & Strings', focus: 'Indexing, Slicing & String Methods' },
    { week: 'Week 4', title: 'Problem Solving Fundamentals', focus: 'Two Pointers & Frequency Counting' },
    { week: 'Week 5', title: 'Core DSA Basics', focus: 'Linear Arrays, Stacks & Queues' },
    { week: 'Week 6', title: 'Relational Database & SQL', focus: 'SELECT, WHERE, JOINs & Aggregations' },
    { week: 'Week 7', title: 'Practical Mini Project', focus: 'CRUD System & Schema Integration' },
    { week: 'Week 8', title: 'Placement Foundation Sprint', focus: 'Quantitative Aptitude & Time-Speed' },
  ];

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
          <div className="p-2.5 rounded-xl bg-amber-950/80 border border-amber-600/80 text-amber-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
              Accelerated Recovery Sprint
            </span>
            <h3 className="text-xl font-bold text-white">I'm Behind — Catch-Up Mode</h3>
          </div>
        </div>

        <p className="text-xs text-slate-300 mb-6 leading-relaxed">
          SkillProof AI identifies your critical missing foundations and reorganizes your daily missions into an 8-week structured catch-up plan. Zero clutter, highest-impact concepts first.
        </p>

        {/* 8-Week Plan Timeline */}
        <div className="space-y-2.5 mb-6">
          {weeks.map((item, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 rounded bg-slate-900 text-indigo-400 font-mono text-[10px] font-bold border border-slate-800">
                  {item.week}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-white">{item.title}</h4>
                  <span className="text-[11px] text-slate-400">{item.focus}</span>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Milestone</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onActivate();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-950/40 transition flex items-center gap-1.5"
          >
            Activate Catch-Up Plan <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
