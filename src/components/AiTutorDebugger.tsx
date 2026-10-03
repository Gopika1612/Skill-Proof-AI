import React, { useState } from 'react';
import { api } from '../api';
import { Sparkles, Bug, BrainCircuit, Send, Lightbulb, HelpCircle, Code2, CheckCircle2 } from 'lucide-react';

export const AiTutorDebugger: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'tutor' | 'debugger'>('tutor');

  // AI Tutor state
  const [tutorTopic, setTutorTopic] = useState('Dynamic Programming & Memoization');
  const [tutorQuery, setTutorQuery] = useState('');
  const [tutorMode, setTutorMode] = useState<'socratic' | 'explain' | 'hint' | 'practice'>('socratic');
  const [tutorHistory, setTutorHistory] = useState<{ query: string; answer: string; mode: string }[]>([]);
  const [isLoadingTutor, setIsLoadingTutor] = useState(false);

  // AI Debugger state
  const sampleBugs = [
    {
      title: 'Off-by-One Loop & Null Pointer in Python',
      language: 'python',
      code: `def find_max_consecutive(nums):
    max_count = 0
    current_count = 0
    for i in range(len(nums) + 1): # BUG: index out of bounds
        if nums[i] == 1:
            current_count += 1
        else:
            if current_count > max_count:
                max_count = current_count
            current_count = 0
    return max_count`,
    },
    {
      title: 'Closure Scoping & Asynchronous Timing in JavaScript',
      language: 'javascript',
      code: `function fetchBatchData(ids) {
  var results = [];
  for (var i = 0; i < ids.length; i++) { // BUG: var vs let closure
    setTimeout(function() {
      results.push({ id: ids[i], processed: true });
    }, 100);
  }
  return results;
}`,
    },
  ];

  const [selectedBugIndex, setSelectedBugIndex] = useState(0);
  const [debuggerCode, setDebuggerCode] = useState(sampleBugs[0].code);
  const [debuggerAttempt, setDebuggerAttempt] = useState('');
  const [hintLevel, setHintLevel] = useState(1);
  const [debuggerResult, setDebuggerResult] = useState<{ hint: string; conceptCheck: string } | null>(null);
  const [isLoadingDebugger, setIsLoadingDebugger] = useState(false);

  const handleAskTutor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tutorQuery.trim()) return;
    setIsLoadingTutor(true);
    try {
      const res = await api.askAiTutor(tutorTopic, tutorQuery, tutorMode);
      setTutorHistory((prev) => [{ query: tutorQuery, answer: res.answer, mode: tutorMode }, ...prev]);
      setTutorQuery('');
    } catch (err: any) {
      console.error('Error asking AI tutor:', err);
    } finally {
      setIsLoadingTutor(false);
    }
  };

  const handleAskDebugger = async () => {
    setIsLoadingDebugger(true);
    try {
      const res = await api.askAiDebugger(
        debuggerCode,
        sampleBugs[selectedBugIndex].language,
        debuggerAttempt,
        hintLevel
      );
      setDebuggerResult(res);
    } catch (err) {
      console.error('Error in AI debugger:', err);
    } finally {
      setIsLoadingDebugger(false);
    }
  };

  const handleSelectSampleBug = (idx: number) => {
    setSelectedBugIndex(idx);
    setDebuggerCode(sampleBugs[idx].code);
    setDebuggerResult(null);
    setDebuggerAttempt('');
  };

  return (
    <div className="space-y-6">
      {/* Tool Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-white">AI Learning & Debugging Studio</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTool('tutor')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTool === 'tutor' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Socratic AI Tutor
          </button>
          <button
            onClick={() => setActiveTool('debugger')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTool === 'debugger' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Bug className="w-3.5 h-3.5" /> Interactive Code Debugger
          </button>
        </div>
      </div>

      {/* AI Tutor View */}
      {activeTool === 'tutor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-400" /> Consult AI Tutor
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Choose Socratic mode to learn principles through guided inquiry, or request direct explanations & hints.
              </p>

              <form onSubmit={handleAskTutor} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Focus Topic / Concept</label>
                  <input
                    type="text"
                    value={tutorTopic}
                    onChange={(e) => setTutorTopic(e.target.value)}
                    placeholder="e.g. SQL Window Functions, Two Pointers, RAG"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Mentoring Style</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'socratic', label: 'Socratic Inquiry' },
                      { id: 'explain', label: 'Direct Explanation' },
                      { id: 'hint', label: 'Progressive Hint' },
                      { id: 'practice', label: 'Practice Check' },
                    ].map((m) => (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => setTutorMode(m.id as any)}
                        className={`p-2 rounded-lg text-xs font-medium text-center border transition ${
                          tutorMode === m.id
                            ? 'bg-indigo-950 border-indigo-500 text-indigo-200'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Your Question or Dilemma</label>
                  <textarea
                    rows={4}
                    value={tutorQuery}
                    onChange={(e) => setTutorQuery(e.target.value)}
                    placeholder="Ask about edge cases, mathematical reasoning, time complexity..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoadingTutor || !tutorQuery.trim()}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-1.5 shadow"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isLoadingTutor ? 'AI Tutor is thinking...' : 'Ask Tutor'}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 min-h-[350px]">
              <h3 className="text-base font-bold text-white mb-4">Interactive Mentoring Stream</h3>
              {tutorHistory.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs italic">
                  Ask a question to begin a high-signal dialogue with the AI Tutor.
                </div>
              ) : (
                <div className="space-y-4">
                  {tutorHistory.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="font-semibold text-indigo-300">You Asked: "{item.query}"</span>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800">
                          {item.mode}
                        </span>
                      </div>
                      <div className="text-slate-200 leading-relaxed whitespace-pre-line pt-2 border-t border-slate-800/80">
                        {item.answer}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI Debugger View */}
      {activeTool === 'debugger' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase">Buggy Code Challenge</span>
                <div className="flex gap-2">
                  {sampleBugs.map((b, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectSampleBug(i)}
                      className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                        selectedBugIndex === i ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      Case {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              <h4 className="text-sm font-bold text-white mb-2">{sampleBugs[selectedBugIndex].title}</h4>
              <textarea
                value={debuggerCode}
                onChange={(e) => setDebuggerCode(e.target.value)}
                rows={10}
                className="w-full bg-slate-950 text-slate-100 font-mono text-xs p-3 rounded-lg border border-slate-800 focus:outline-none focus:border-indigo-500 leading-relaxed"
                spellCheck={false}
              />

              <div className="mt-4 space-y-2">
                <label className="block text-xs font-semibold text-slate-300">Your Diagnosis or Proposed Fix:</label>
                <input
                  type="text"
                  value={debuggerAttempt}
                  onChange={(e) => setDebuggerAttempt(e.target.value)}
                  placeholder="Explain what is causing the defect or how you fixed the line..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" /> Progressive Hint System
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Challenge yourself to debug without giving away the full answer immediately.
              </p>

              <div className="flex gap-2 mb-4">
                {[1, 2, 3].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setHintLevel(lvl)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition ${
                      hintLevel === lvl
                        ? 'bg-amber-950 border-amber-600 text-amber-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Level {lvl} {lvl === 1 ? '(Subtle)' : lvl === 2 ? '(Line Focus)' : '(Root Cause)'}
                  </button>
                ))}
              </div>

              <button
                onClick={handleAskDebugger}
                disabled={isLoadingDebugger}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-1.5 shadow"
              >
                <Bug className="w-3.5 h-3.5" />
                {isLoadingDebugger ? 'Analyzing execution flow...' : `Request Hint Level ${hintLevel}`}
              </button>

              {debuggerResult && (
                <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-amber-900/40 space-y-3 text-xs">
                  <div>
                    <span className="text-amber-400 font-bold uppercase block mb-1">Debugger Guidance:</span>
                    <p className="text-slate-200 leading-relaxed">{debuggerResult.hint}</p>
                  </div>

                  {debuggerResult.conceptCheck && (
                    <div className="pt-2 border-t border-slate-800">
                      <span className="text-indigo-300 font-semibold block mb-0.5">Concept Check:</span>
                      <p className="text-slate-400 italic">{debuggerResult.conceptCheck}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
