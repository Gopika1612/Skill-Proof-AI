import React, { useState, useEffect } from 'react';
import { CodingChallenge, CodingSubmission } from '../types';
import { api } from '../api';
import { Play, Send, CheckCircle2, XCircle, Clock, Code2, Database, Terminal, FileCode2, History } from 'lucide-react';

export const CodeLab: React.FC = () => {
  const [challenges, setChallenges] = useState<CodingChallenge[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<CodingChallenge | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<'javascript' | 'python' | 'sql'>('javascript');
  const [code, setCode] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [runResult, setRunResult] = useState<any | null>(null);
  const [submissions, setSubmissions] = useState<CodingSubmission[]>([]);
  const [activeTab, setActiveTab] = useState<'editor' | 'submissions'>('editor');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const chRes = await api.getCodingChallenges();
      setChallenges(chRes.challenges);
      if (chRes.challenges.length > 0) {
        selectChallenge(chRes.challenges[0], 'javascript');
      }
      const subRes = await api.getCodingSubmissions();
      setSubmissions(subRes.submissions);
    } catch (err) {
      console.error('Failed to load coding data:', err);
    }
  };

  const selectChallenge = (ch: CodingChallenge, lang?: 'javascript' | 'python' | 'sql') => {
    setSelectedChallenge(ch);
    const targetLang = lang || (ch.starterCode.sql ? 'sql' : 'javascript');
    setSelectedLanguage(targetLang);
    setCode(ch.starterCode[targetLang] || ch.starterCode.javascript || '');
    setRunResult(null);
  };

  const handleLanguageChange = (lang: 'javascript' | 'python' | 'sql') => {
    setSelectedLanguage(lang);
    if (selectedChallenge) {
      setCode(selectedChallenge.starterCode[lang] || '');
    }
    setRunResult(null);
  };

  const handleRun = async () => {
    if (!selectedChallenge) return;
    setIsRunning(true);
    setRunResult(null);
    try {
      const res = await api.runCode({
        challengeId: selectedChallenge.id,
        language: selectedLanguage,
        code,
      });
      setRunResult(res.result);
    } catch (err: any) {
      setRunResult({
        status: 'runtime_error',
        error: err.message || 'Execution error',
        testDetails: [],
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedChallenge) return;
    setIsSubmitting(true);
    setRunResult(null);
    try {
      const res = await api.submitCode({
        challengeId: selectedChallenge.id,
        language: selectedLanguage,
        code,
      });
      setRunResult(res.runResult);

      const subRes = await api.getCodingSubmissions();
      setSubmissions(subRes.submissions);

      if (res.runResult.status === 'accepted') {
        setSuccessToast(`Challenge Solved! 100% verified evidence recorded in your Skill Profile.`);
        setTimeout(() => setSuccessToast(null), 5000);
      }
    } catch (err: any) {
      setRunResult({
        status: 'runtime_error',
        error: err.message || 'Submission error',
        testDetails: [],
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-semibold">{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="text-xs text-emerald-400 hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Header & Challenge Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="flex items-center gap-3 overflow-x-auto pb-1 sm:pb-0">
          <Code2 className="w-5 h-5 text-indigo-400 shrink-0" />
          <span className="text-xs font-semibold uppercase text-slate-400 shrink-0">Challenges:</span>
          {challenges.map((c) => (
            <button
              key={c.id}
              onClick={() => selectChallenge(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                selectedChallenge?.id === c.id
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('editor')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'editor' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" /> Code & Test
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'submissions' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" /> Submissions ({submissions.length})
          </button>
        </div>
      </div>

      {activeTab === 'editor' && selectedChallenge && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Problem Description & Test Cases (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                  {selectedChallenge.category}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded uppercase font-semibold ${
                    selectedChallenge.difficulty === 'easy'
                      ? 'text-emerald-400 bg-emerald-950/60'
                      : 'text-amber-400 bg-amber-950/60'
                  }`}
                >
                  {selectedChallenge.difficulty}
                </span>
              </div>

              <h2 className="text-xl font-bold text-white mb-2">{selectedChallenge.title}</h2>
              <div className="text-sm text-slate-300 whitespace-pre-line leading-relaxed mb-6 font-normal">
                {selectedChallenge.description}
              </div>

              {selectedChallenge.sqlSchema && (
                <div className="mb-6">
                  <h4 className="text-xs uppercase font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-indigo-400" /> Database Schema
                  </h4>
                  <pre className="p-3 bg-slate-950 rounded-lg text-xs text-indigo-200 font-mono overflow-x-auto border border-slate-800">
                    {selectedChallenge.sqlSchema.trim()}
                  </pre>
                </div>
              )}

              <h4 className="text-xs uppercase font-semibold text-slate-400 mb-2">Test Case Specifications</h4>
              <div className="space-y-2">
                {selectedChallenge.testCases.map((tc, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 text-xs font-mono">
                    <div className="text-slate-400 mb-1">
                      Case {idx + 1} {tc.isHidden && <span className="text-amber-400 ml-1">(Hidden Test)</span>}
                    </div>
                    <div className="text-slate-300">
                      <span className="text-slate-500">Input:</span> {tc.input}
                    </div>
                    <div className="text-slate-300">
                      <span className="text-slate-500">Expected:</span> {tc.expectedOutput}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Code Editor & Execution Output (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
              {/* Language Toolbar */}
              <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-semibold text-slate-300">Execution Runtime:</span>
                  <div className="flex items-center gap-1">
                    {selectedChallenge.starterCode.sql ? (
                      <button
                        onClick={() => handleLanguageChange('sql')}
                        className={`px-2.5 py-1 rounded text-xs font-medium ${
                          selectedLanguage === 'sql' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        SQL (SQLite Engine)
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleLanguageChange('javascript')}
                          className={`px-2.5 py-1 rounded text-xs font-medium ${
                            selectedLanguage === 'javascript'
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          Node.js (JS)
                        </button>
                        <button
                          onClick={() => handleLanguageChange('python')}
                          className={`px-2.5 py-1 rounded text-xs font-medium ${
                            selectedLanguage === 'python'
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          Python 3.10
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRun}
                    disabled={isRunning || isSubmitting}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5 text-indigo-400" /> {isRunning ? 'Running...' : 'Run Code'}
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isRunning || isSubmitting}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" /> {isSubmitting ? 'Evaluating...' : 'Submit & Prove'}
                  </button>
                </div>
              </div>

              {/* Code Textarea with mono font */}
              <div className="relative">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-80 p-4 bg-slate-950 text-slate-100 font-mono text-xs md:text-sm resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
                  placeholder="// Write your solution here..."
                  spellCheck={false}
                />
              </div>

              {/* Real Output & Evaluation Console */}
              <div className="border-t border-slate-800 bg-slate-950 p-4 min-h-[140px]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase text-slate-400 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-indigo-400" /> Execution Results & Console
                  </span>
                  {runResult && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {runResult.executionTimeMs}ms
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded font-semibold ${
                          runResult.status === 'accepted'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-rose-950 text-rose-400 border border-rose-800'
                        }`}
                      >
                        {runResult.status === 'accepted' ? 'Accepted' : runResult.status.toUpperCase()} (
                        {runResult.passedTests}/{runResult.totalTests} passed)
                      </span>
                    </div>
                  )}
                </div>

                {!runResult && !isRunning && (
                  <p className="text-xs text-slate-500 italic mt-2">
                    Press "Run Code" or "Submit & Prove" to execute on the native backend runner.
                  </p>
                )}

                {isRunning && (
                  <div className="text-xs text-indigo-400 animate-pulse mt-2">
                    Executing code in sandboxed runtime...
                  </div>
                )}

                {runResult && (
                  <div className="space-y-3 mt-3">
                    {runResult.error && (
                      <div className="p-3 rounded bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-mono">
                        {runResult.error}
                      </div>
                    )}

                    {runResult.testDetails?.length > 0 && (
                      <div className="space-y-2">
                        {runResult.testDetails.map((td: any, i: number) => (
                          <div
                            key={i}
                            className={`p-2.5 rounded-lg border text-xs font-mono ${
                              td.passed
                                ? 'bg-emerald-950/20 border-emerald-900/50 text-emerald-300'
                                : 'bg-rose-950/20 border-rose-900/50 text-rose-300'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold flex items-center gap-1">
                                {td.passed ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <XCircle className="w-3.5 h-3.5 text-rose-400" />
                                )}
                                Test Case #{i + 1}
                              </span>
                              <span>{td.passed ? 'PASSED' : 'FAILED'}</span>
                            </div>
                            <div className="text-slate-400">
                              Input: <span className="text-slate-200">{td.input}</span>
                            </div>
                            <div className="text-slate-400">
                              Expected: <span className="text-emerald-400">{td.expected}</span>
                            </div>
                            <div className="text-slate-400">
                              Actual: <span className={td.passed ? 'text-emerald-400' : 'text-rose-400'}>{td.actual}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submissions Tab */}
      {activeTab === 'submissions' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-base font-bold text-white mb-4">Your Verified Code Submissions</h3>
          {submissions.length === 0 ? (
            <p className="text-sm text-slate-400">No submissions yet. Solve a challenge to log verified evidence.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase">
                    <th className="pb-3 font-semibold">Challenge</th>
                    <th className="pb-3 font-semibold">Language</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Score</th>
                    <th className="pb-3 font-semibold">Runtime</th>
                    <th className="pb-3 font-semibold">Submitted At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {submissions.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-800/40">
                      <td className="py-3 font-medium text-white">{s.challengeTitle}</td>
                      <td className="py-3 text-slate-300 uppercase">{s.language}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded font-semibold ${
                            s.status === 'accepted'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-rose-950 text-rose-400 border border-rose-800'
                          }`}
                        >
                          {s.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 font-semibold text-slate-200">
                        {s.passedTests}/{s.totalTests} ({s.score}%)
                      </td>
                      <td className="py-3 text-slate-400">{s.executionTimeMs}ms</td>
                      <td className="py-3 text-slate-400">{new Date(s.submittedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
