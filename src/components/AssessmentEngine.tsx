import React, { useState, useEffect } from 'react';
import { AptitudeQuestion } from '../types';
import { Clock, CheckCircle2, XCircle, AlertCircle, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';

interface AssessmentEngineProps {
  title: string;
  subtitle?: string;
  questions: AptitudeQuestion[];
  timeLimitMinutes?: number;
  testType: 'daily_practice' | 'daily_test' | 'weekly_test' | 'mistake_retry' | 'speed_challenge';
  onComplete: (data: {
    answers: { questionId: string; userAnswer: number; timeSpentSec: number }[];
    timeSpentSec: number;
  }) => Promise<void>;
  onExit: () => void;
}

export const AssessmentEngine: React.FC<AssessmentEngineProps> = ({
  title,
  subtitle,
  questions,
  timeLimitMinutes,
  testType,
  onComplete,
  onExit,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [questionTimes, setQuestionTimes] = useState<Record<number, number>>({});
  const [secondsRemaining, setSecondsRemaining] = useState<number>(
    timeLimitMinutes ? timeLimitMinutes * 60 : 0
  );
  const [totalSecondsSpent, setTotalSecondsSpent] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedResult, setCompletedResult] = useState<{
    score: number;
    total: number;
    accuracy: number;
  } | null>(null);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTotalSecondsSpent((prev) => prev + 1);
      setQuestionTimes((prev) => ({
        ...prev,
        [currentIndex]: (prev[currentIndex] || 0) + 1,
      }));

      if (timeLimitMinutes) {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, timeLimitMinutes]);

  const handleSelectOption = (optionIndex: number) => {
    if (completedResult) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIndex,
    }));
  };

  const handleAutoSubmit = async () => {
    if (isSubmitting || completedResult) return;
    await submitTest();
  };

  const submitTest = async () => {
    setIsSubmitting(true);
    let correct = 0;
    const formattedAnswers = questions.map((q, idx) => {
      const uAns = userAnswers[idx] !== undefined ? userAnswers[idx] : -1;
      if (uAns === q.correctAnswer) correct++;
      return {
        questionId: q.id,
        userAnswer: uAns,
        timeSpentSec: questionTimes[idx] || 20,
      };
    });

    const accuracy = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;
    setCompletedResult({
      score: correct,
      total: questions.length,
      accuracy,
    });

    try {
      await onComplete({
        answers: formattedAnswers,
        timeSpentSec: totalSecondsSpent,
      });
    } catch (err) {
      console.error('Error submitting assessment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (questions.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-xl text-slate-300">
        <AlertCircle className="w-12 h-12 mx-auto text-amber-400 mb-3" />
        <h3 className="text-lg font-semibold text-white">No questions available</h3>
        <p className="text-sm text-slate-400 mt-1 mb-4">
          All questions for this category have been completed or filter matched 0 questions.
        </p>
        <button
          onClick={onExit}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium"
        >
          Return to Hub
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const answeredCount = Object.keys(userAnswers).length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden text-slate-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <button
              onClick={onExit}
              className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-white tracking-tight">{title}</h2>
          </div>
          {subtitle && <p className="text-xs text-slate-400 ml-7">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-4">
          {timeLimitMinutes && !completedResult && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-sm font-mono border border-slate-700">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span className={secondsRemaining < 120 ? 'text-rose-400 font-bold animate-pulse' : 'text-slate-200'}>
                {formatTime(secondsRemaining)}
              </span>
            </div>
          )}

          <div className="text-xs text-slate-400 font-medium">
            Answered: <span className="text-indigo-400 font-bold">{answeredCount}</span> / {questions.length}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-1.5">
        <div
          className="bg-indigo-500 h-1.5 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Main Body */}
      {!completedResult ? (
        <div className="p-6 md:p-8">
          {/* Question Meta */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4 text-xs font-medium">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60 font-semibold">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {currentQ.category}
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-400">
                {currentQ.topicName}
              </span>
            </div>

            <span
              className={`px-2 py-0.5 rounded text-xs uppercase font-semibold ${
                currentQ.difficulty === 'easy'
                  ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800/40'
                  : currentQ.difficulty === 'medium'
                  ? 'text-amber-400 bg-amber-950/60 border border-amber-800/40'
                  : 'text-rose-400 bg-rose-950/60 border border-rose-800/40'
              }`}
            >
              {currentQ.difficulty}
            </span>
          </div>

          {/* Question Text */}
          <div className="mb-6 bg-slate-950 p-5 rounded-xl border border-slate-800/80">
            <p className="text-base md:text-lg font-medium text-slate-100 whitespace-pre-line leading-relaxed">
              {currentQ.question}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = userAnswers[currentIndex] === optIdx;
              const optionLabel = ['A', 'B', 'C', 'D'][optIdx] || String(optIdx + 1);

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-indigo-950/80 border-indigo-500 text-white shadow-md shadow-indigo-950/30'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 text-slate-200'
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {optionLabel}
                  </span>
                  <span className="text-sm md:text-base leading-relaxed">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>

            <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto max-w-xs px-2">
              {questions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-7 h-7 rounded-md text-xs font-semibold transition ${
                    idx === currentIndex
                      ? 'bg-indigo-600 text-white ring-2 ring-indigo-400'
                      : userAnswers[idx] !== undefined
                      ? 'bg-slate-700 text-indigo-300'
                      : 'bg-slate-800 text-slate-500 hover:bg-slate-700'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 transition"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={submitTest}
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition disabled:opacity-50 shadow-lg shadow-emerald-950/40"
              >
                {isSubmitting ? 'Evaluating...' : 'Submit & Analyze'}
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Results & Review View */
        <div className="p-6 md:p-8">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 mb-8 text-center">
            <div className="inline-flex p-3 rounded-full bg-indigo-950 text-indigo-400 mb-3 border border-indigo-800">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">Assessment Complete</h3>
            <p className="text-sm text-slate-400 mb-6">
              Skill proof evidence recorded into your verified profile ledger.
            </p>

            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <span className="text-xs text-slate-400 uppercase font-semibold">Score</span>
                <p className="text-2xl font-bold text-white mt-0.5">
                  {completedResult.score} / {completedResult.total}
                </p>
              </div>

              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <span className="text-xs text-slate-400 uppercase font-semibold">Accuracy</span>
                <p
                  className={`text-2xl font-bold mt-0.5 ${
                    completedResult.accuracy >= 75
                      ? 'text-emerald-400'
                      : completedResult.accuracy >= 50
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {completedResult.accuracy}%
                </p>
              </div>

              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <span className="text-xs text-slate-400 uppercase font-semibold">Time Spent</span>
                <p className="text-2xl font-bold text-indigo-300 mt-0.5">
                  {formatTime(totalSecondsSpent)}
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Question Review */}
          <h4 className="text-base font-semibold text-white mb-4">Detailed Question Review & Explanations</h4>
          <div className="space-y-4 mb-8">
            {questions.map((q, idx) => {
              const uAns = userAnswers[idx];
              const isCorrect = uAns === q.correctAnswer;
              const answered = uAns !== undefined && uAns !== -1;

              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-xl border ${
                    isCorrect
                      ? 'bg-emerald-950/20 border-emerald-900/40'
                      : 'bg-rose-950/20 border-rose-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-semibold text-slate-400">
                      Q{idx + 1}. {q.topicName} ({q.subtopic})
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-semibold flex items-center gap-1 ${
                        isCorrect
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" /> Incorrect
                        </>
                      )}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-slate-100 mb-3">{q.question}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                    <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-400 block mb-0.5">Your Answer:</span>
                      <span className={isCorrect ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                        {answered ? q.options[uAns] : 'Not Answered'}
                      </span>
                    </div>

                    <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-400 block mb-0.5">Correct Answer:</span>
                      <span className="text-emerald-400 font-semibold">{q.options[q.correctAnswer]}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-lg text-xs text-slate-300 border border-slate-800">
                    <strong className="text-indigo-300 block mb-1">Step-by-step Solution:</strong>
                    {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onExit}
              className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition"
            >
              Back to Aptitude Hub
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
