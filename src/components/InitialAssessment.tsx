import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, Sparkles, Brain, Award } from 'lucide-react';

interface InitialAssessmentProps {
  onComplete: () => void;
}

interface DiagnosticQuestion {
  id: string;
  category: string;
  difficulty: 'easy' | 'medium';
  question: string;
  options: string[];
  correctAnswer: number;
}

export const InitialAssessment: React.FC<InitialAssessmentProps> = ({ onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isFinished, setIsFinished] = useState(false);

  // Short, friendly, confidence-building diagnostic questions across core disciplines
  const questions: DiagnosticQuestion[] = [
    {
      id: 'diag-1',
      category: 'Programming & Logic',
      difficulty: 'easy',
      question: 'What is the output of this logic?\nx = 5\ny = 3\nx = x + y\nWhat is the value of x?',
      options: ['5', '8', '3', 'Error'],
      correctAnswer: 1, // 8
    },
    {
      id: 'diag-2',
      category: 'Problem Solving',
      difficulty: 'easy',
      question: 'If 3 software engineers can build 3 features in 3 days, how many days will 6 engineers take to build 6 features at the same pace?',
      options: ['3 days', '6 days', '1 day', '9 days'],
      correctAnswer: 0, // 3 days
    },
    {
      id: 'diag-3',
      category: 'SQL & Database',
      difficulty: 'easy',
      question: 'Which SQL keyword is used to retrieve only records that satisfy a specific condition?',
      options: ['ORDER BY', 'GROUP BY', 'WHERE', 'JOIN'],
      correctAnswer: 2, // WHERE
    },
    {
      id: 'diag-4',
      category: 'Data Structures & Algorithms',
      difficulty: 'easy',
      question: 'Which data structure follows the Last-In, First-Out (LIFO) principle, like a stack of plates?',
      options: ['Queue', 'Stack', 'Array', 'Linked List'],
      correctAnswer: 1, // Stack
    },
    {
      id: 'diag-5',
      category: 'Aptitude & Percentages',
      difficulty: 'easy',
      question: 'A software subscription costs $100. If there is a 20% student discount, what is the final price?',
      options: ['$75', '$80', '$85', '$90'],
      correctAnswer: 1, // $80
    },
    {
      id: 'diag-6',
      category: 'Technical Fundamentals',
      difficulty: 'easy',
      question: 'What is the primary role of Git in modern software engineering teams?',
      options: [
        'Running databases in the cloud',
        'Tracking file changes and collaborating on code',
        'Compiling JavaScript to machine bytecode',
        'Designing web page animations'
      ],
      correctAnswer: 1,
    },
  ];

  const handleSelect = (optionIdx: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentIdx]: optionIdx,
    }));
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  // Compute pleasant, encouraging skill scores
  const getLabelForScore = (score: number) => {
    if (score >= 70) return { label: 'Strong', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800' };
    if (score >= 40) return { label: 'Developing', color: 'text-indigo-400 bg-indigo-950/60 border-indigo-800' };
    if (score >= 20) return { label: 'Needs Practice', color: 'text-amber-400 bg-amber-950/60 border-amber-800' };
    return { label: 'Starting Point', color: 'text-slate-300 bg-slate-800 border-slate-700' };
  };

  const q = questions[currentIdx];
  const isSelected = userAnswers[currentIdx] !== undefined;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 selection:bg-indigo-500 selection:text-white">
      <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl relative">
        {!isFinished ? (
          <div>
            {/* Friendly Non-Intimidating Header */}
            <div className="mb-6 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2 mb-1">
                <span className="p-1 rounded bg-indigo-950 text-indigo-400 border border-indigo-800">
                  <Brain className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wide">
                  Friendly Diagnostic • Question {currentIdx + 1} of {questions.length}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white">Let’s understand your current baseline</h2>
              <p className="text-xs text-slate-400 mt-1">
                This is not an exam. It helps SkillProof AI understand where to start you without repeating what you already know.
              </p>
            </div>

            {/* Question Box */}
            <div className="mb-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                {q.category}
              </span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6">
              <p className="text-sm md:text-base font-semibold text-slate-100 whitespace-pre-line leading-relaxed">
                {q.question}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-2.5 mb-6">
              {q.options.map((opt, optIdx) => {
                const checked = userAnswers[currentIdx] === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelect(optIdx)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs md:text-sm transition flex items-center gap-3 ${
                      checked
                        ? 'bg-indigo-950/80 border-indigo-500 text-white shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                        checked ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {['A', 'B', 'C', 'D'][optIdx]}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                disabled={!isSelected}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition disabled:opacity-40 flex items-center gap-2"
              >
                {currentIdx < questions.length - 1 ? 'Next Question' : 'View My Skill Map'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* YOUR CURRENT SKILL MAP */
          <div>
            <div className="text-center mb-6">
              <div className="inline-flex p-3 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 mb-2">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-white">YOUR CURRENT SKILL MAP</h2>
              <p className="text-xs text-slate-400 mt-1">
                Here is your baseline. SkillProof AI will now tailor your lessons and daily practice to elevate these skills systematically.
              </p>
            </div>

            <div className="space-y-3 mb-8">
              {[
                { name: 'Programming Fundamentals', score: 35 },
                { name: 'Problem Solving & Logic', score: 40 },
                { name: 'SQL & Database', score: 20 },
                { name: 'DSA (Data Structures & Alg.)', score: 15 },
                { name: 'Aptitude & Analytical', score: 50 },
                { name: 'Software Engineering (Git/OOP)', score: 30 },
              ].map((item, idx) => {
                const labelInfo = getLabelForScore(item.score);
                return (
                  <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-white">{item.name}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${labelInfo.color}`}>
                          {labelInfo.label}
                        </span>
                        <span className="text-xs font-bold text-indigo-400">{item.score}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={onComplete}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2"
            >
              Go to My Personalized Dashboard <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
