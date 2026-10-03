import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Briefcase, CheckCircle2, MessageSquare, Award, Clock, ArrowRight, Play, BookOpen } from 'lucide-react';

export const PlacementHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'mock_test' | 'interview_sim' | 'syllabus'>('mock_test');
  const [questions, setQuestions] = useState<any[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTestActive, setIsTestActive] = useState(false);
  const [testResult, setTestResult] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Interview Simulator state
  const [interviewRole, setInterviewRole] = useState('Full Stack & AI Engineer');
  const [interviewStep, setInterviewStep] = useState(0);
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [interviewLog, setInterviewLog] = useState<{ question: string; answer: string; feedback: string }[]>([]);
  const [isEvaluatingAnswer, setIsEvaluatingAnswer] = useState(false);

  const interviewQuestions = [
    {
      q: 'Explain how you design a resilient caching strategy with Redis for high-frequency database reads, and how you handle cache stampedes.',
      expectedConcept: 'Cache-aside pattern, TTL jitter, mutual exclusion locks or background probabilistic early expiration.',
    },
    {
      q: 'In a modern RAG system, what chunking strategies and embedding distance metrics do you use, and how do you ensure the model doesn’t hallucinate?',
      expectedConcept: 'Semantic chunking, cosine similarity, top-k retrieval, prompt guardrails, and citation verification.',
    },
    {
      q: 'Tell me about a challenging bug you encountered in production involving race conditions or async execution, and how you resolved it.',
      expectedConcept: 'Systematic debugging, reproduction, locks, idempotency, or atomic database operations.',
    },
  ];

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const res = await api.getPlacementQuestions();
      setQuestions(res.questions);
    } catch (err) {
      console.error('Failed to load placement questions:', err);
    }
  };

  const handleStartTest = () => {
    setUserAnswers({});
    setCurrentIndex(0);
    setTestResult(null);
    setIsTestActive(true);
  };

  const handleSubmitTest = async () => {
    setIsSubmitting(true);
    const answers = questions.map((q, idx) => ({
      questionId: q.id,
      userAnswer: userAnswers[idx] !== undefined ? userAnswers[idx] : -1,
    }));

    try {
      const res = await api.submitPlacementMock({
        answers,
        timeSpentSec: 360,
      });
      setTestResult(res);
      setIsTestActive(false);
    } catch (err) {
      console.error('Error submitting placement test:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEvaluateInterviewStep = async () => {
    if (!candidateAnswer.trim()) return;
    setIsEvaluatingAnswer(true);

    const currentQ = interviewQuestions[interviewStep].q;
    try {
      // Use AI Tutor service for rigorous evaluation
      const res = await api.askAiTutor(
        `Placement Interview: ${interviewRole}`,
        `Candidate answered the question "${currentQ}" with: "${candidateAnswer}". Evaluate their technical depth, communication, and problem solving in 2-3 concise sentences.`,
        'explain'
      );

      setInterviewLog((prev) => [
        ...prev,
        {
          question: currentQ,
          answer: candidateAnswer,
          feedback: res.answer,
        },
      ]);

      setCandidateAnswer('');
      if (interviewStep < interviewQuestions.length - 1) {
        setInterviewStep((prev) => prev + 1);
      }
    } catch (err) {
      console.error('Error in interview evaluation:', err);
    } finally {
      setIsEvaluatingAnswer(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-white">Campus & Product Placement Hub</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('mock_test')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'mock_test' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Combined Mock Exam
          </button>
          <button
            onClick={() => setActiveTab('interview_sim')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'interview_sim'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Technical Interview Simulator
          </button>
          <button
            onClick={() => setActiveTab('syllabus')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'syllabus' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Placement Core Topics
          </button>
        </div>
      </div>

      {/* Mock Test Tab */}
      {activeTab === 'mock_test' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          {!isTestActive && !testResult && (
            <div className="max-w-xl mx-auto text-center py-6">
              <Award className="w-12 h-12 mx-auto text-indigo-400 mb-3" />
              <h3 className="text-xl font-bold text-white mb-2">Grand Placement Readiness Simulation</h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Covers high-frequency campus placement domains: Quantitative Aptitude, Operating Systems, Relational DBMS & SQL, and DSA Complexity. Results are logged to your verification ledger.
              </p>
              <button
                onClick={handleStartTest}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-xs flex items-center gap-2 mx-auto shadow-lg"
              >
                <Play className="w-4 h-4" /> Start Placement Mock Test
              </button>
            </div>
          )}

          {isTestActive && questions.length > 0 && (
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <div>
                  <span className="text-xs font-semibold text-indigo-400">
                    Question {currentIndex + 1} of {questions.length}
                  </span>
                  <span className="text-xs text-slate-400 ml-2">[{questions[currentIndex].section}]</span>
                </div>
                <span className="text-xs text-slate-400">Section: {questions[currentIndex].topic}</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6">
                <p className="text-sm font-medium text-slate-100">{questions[currentIndex].question}</p>
              </div>

              <div className="space-y-3 mb-6">
                {questions[currentIndex].options.map((opt: string, optIdx: number) => {
                  const isSelected = userAnswers[currentIndex] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => setUserAnswers((prev) => ({ ...prev, [currentIndex]: optIdx }))}
                      className={`w-full text-left p-3.5 rounded-lg border text-xs md:text-sm transition flex items-center gap-3 ${
                        isSelected
                          ? 'bg-indigo-950 border-indigo-500 text-white'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-200'
                      }`}
                    >
                      <span className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-300">
                        {['A', 'B', 'C', 'D'][optIdx]}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="px-4 py-1.5 rounded bg-slate-800 text-xs text-slate-300 disabled:opacity-40"
                >
                  Previous
                </button>

                {currentIndex < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIndex((prev) => prev + 1)}
                    className="px-4 py-1.5 rounded bg-indigo-600 text-xs text-white"
                  >
                    Next Question
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitTest}
                    disabled={isSubmitting}
                    className="px-5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white disabled:opacity-50"
                  >
                    {isSubmitting ? 'Evaluating...' : 'Submit Placement Exam'}
                  </button>
                )}
              </div>
            </div>
          )}

          {testResult && (
            <div className="space-y-6">
              <div className="p-6 bg-slate-950 border border-slate-800 rounded-xl text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                <h3 className="text-xl font-bold text-white mb-1">Placement Mock Complete</h3>
                <p className="text-xs text-slate-400 mb-4">Evidence recorded to your SkillProof Profile.</p>
                <div className="text-3xl font-black text-indigo-400 mb-2">
                  {testResult.score} / {testResult.total} ({testResult.accuracy}%)
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(testResult.breakdown || {}).map(([sec, stats]: any) => (
                  <div key={sec} className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs">
                    <span className="text-slate-400 block mb-1 uppercase font-semibold">{sec}</span>
                    <span className="text-base font-bold text-white">
                      {stats.correct} / {stats.total}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setTestResult(null)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold"
              >
                Take Another Placement Test
              </button>
            </div>
          )}
        </div>
      )}

      {/* Interview Simulator Tab */}
      {activeTab === 'interview_sim' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-400" /> Interactive Technical Interview Simulator
              </h3>
              <p className="text-xs text-slate-400">
                Practice answering realistic architecture, DSA, and systems questions with instant AI rubric evaluation.
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-medium">
              Role: {interviewRole}
            </span>
          </div>

          {/* Current Question Box */}
          <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl mb-6">
            <span className="text-[11px] font-semibold uppercase text-indigo-400 block mb-1">
              Interviewer Prompt #{interviewStep + 1} of {interviewQuestions.length}
            </span>
            <p className="text-sm font-semibold text-white leading-relaxed">
              "{interviewQuestions[interviewStep].q}"
            </p>
          </div>

          {/* Answer Box */}
          <div className="space-y-3 mb-6">
            <label className="block text-xs font-semibold text-slate-300">Your Detailed Technical Response:</label>
            <textarea
              rows={4}
              value={candidateAnswer}
              onChange={(e) => setCandidateAnswer(e.target.value)}
              placeholder="State your approach, architecture principles, trade-offs, and edge cases clearly..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
            />
            <div className="flex justify-end">
              <button
                onClick={handleEvaluateInterviewStep}
                disabled={isEvaluatingAnswer || !candidateAnswer.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition disabled:opacity-50 flex items-center gap-1.5"
              >
                {isEvaluatingAnswer ? 'Evaluating with AI...' : 'Submit Answer for Feedback'}
              </button>
            </div>
          </div>

          {/* Interview History / Feedback Log */}
          {interviewLog.length > 0 && (
            <div className="border-t border-slate-800 pt-6 space-y-4">
              <h4 className="text-xs uppercase font-semibold text-slate-400">Evaluation & Feedback Log</h4>
              {interviewLog.map((log, idx) => (
                <div key={idx} className="p-4 bg-slate-950 border border-slate-800/80 rounded-xl space-y-2 text-xs">
                  <div className="font-semibold text-slate-300">
                    <span className="text-indigo-400 mr-1.5">Q{idx + 1}:</span> {log.question}
                  </div>
                  <div className="text-slate-400 pl-4 border-l border-slate-800">
                    <span className="text-slate-500 block mb-0.5">Your Answer:</span>
                    {log.answer}
                  </div>
                  <div className="p-3 bg-indigo-950/40 border border-indigo-900/50 rounded-lg text-indigo-200">
                    <strong className="block text-indigo-300 mb-0.5">Interviewer Appraisal:</strong>
                    {log.feedback}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Syllabus Tab */}
      {activeTab === 'syllabus' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" /> Placement Core Curriculum Blueprint
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <h4 className="font-bold text-indigo-300 mb-2">Operating Systems</h4>
              <ul className="space-y-1 text-slate-300 list-disc list-inside">
                <li>Processes vs Threads, Context Switching</li>
                <li>CPU Scheduling (Round Robin, SJF, Priority)</li>
                <li>Deadlock Prevention & Banker's Algorithm</li>
                <li>Paging, Virtual Memory & Page Replacement</li>
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <h4 className="font-bold text-indigo-300 mb-2">DBMS & SQL</h4>
              <ul className="space-y-1 text-slate-300 list-disc list-inside">
                <li>ACID Properties & Transaction Isolation Levels</li>
                <li>Normalization (1NF, 2NF, 3NF, BCNF)</li>
                <li>Indexing (B-Tree, Hash Indexes) & Query Optimization</li>
                <li>SQL Window Functions (RANK, DENSE_RANK, LEAD, LAG)</li>
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <h4 className="font-bold text-indigo-300 mb-2">Computer Networks</h4>
              <ul className="space-y-1 text-slate-300 list-disc list-inside">
                <li>OSI & TCP/IP 7-Layer Protocol Stack</li>
                <li>TCP 3-Way Handshake vs UDP</li>
                <li>DNS, HTTP/1.1 vs HTTP/2 vs HTTP/3</li>
                <li>Subnetting, CIDR, and Routing Algorithms</li>
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <h4 className="font-bold text-indigo-300 mb-2">Data Structures & Algorithms</h4>
              <ul className="space-y-1 text-slate-300 list-disc list-inside">
                <li>Two Pointers, Sliding Window, Monotonic Stacks</li>
                <li>Trees & Binary Search Trees (LCA, Traversals)</li>
                <li>Graphs (BFS, DFS, Dijkstra, Topological Sort)</li>
                <li>Dynamic Programming (Memoization & Tabulation)</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
