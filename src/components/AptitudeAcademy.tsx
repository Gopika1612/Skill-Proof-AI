import React, { useState, useEffect } from 'react';
import { AptitudeTopic, AptitudeQuestion, AptitudeMistake, AptitudeAttempt } from '../types';
import { api } from '../api';
import { AssessmentEngine } from './AssessmentEngine';
import { Target, Zap, Calendar, Award, BookX, RotateCcw, Play, CheckCircle2, ChevronRight, BarChart3 } from 'lucide-react';

export const AptitudeAcademy: React.FC = () => {
  const [topics, setTopics] = useState<AptitudeTopic[]>([]);
  const [mistakes, setMistakes] = useState<AptitudeMistake[]>([]);
  const [attempts, setAttempts] = useState<AptitudeAttempt[]>([]);
  const [activeSession, setActiveSession] = useState<{
    title: string;
    subtitle: string;
    questions: AptitudeQuestion[];
    timeLimitMinutes?: number;
    testType: 'daily_practice' | 'daily_test' | 'weekly_test' | 'mistake_retry' | 'speed_challenge';
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<'All' | 'Quantitative' | 'Logical Reasoning' | 'Verbal Ability'>('All');

  useEffect(() => {
    loadAcademyData();
  }, []);

  const loadAcademyData = async () => {
    setLoading(true);
    try {
      const [tRes, mRes, aRes] = await Promise.all([
        api.getAptitudeTopics(),
        api.getMistakes(),
        api.getAptitudeAttempts(),
      ]);
      setTopics(tRes.topics);
      setMistakes(mRes.mistakes);
      setAttempts(aRes.attempts);
    } catch (err) {
      console.error('Error loading aptitude academy data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Launchers
  const startDailyPractice = async () => {
    const res = await api.getDailyPractice();
    setActiveSession({
      title: "Today's Dynamic Aptitude Practice",
      subtitle: `Targeting: ${res.focusTopics.join(', ')}`,
      questions: res.questions,
      testType: 'daily_practice',
    });
  };

  const startDailyTest = async () => {
    const res = await api.getDailyTest();
    setActiveSession({
      title: res.testTitle,
      subtitle: 'Adaptive Placement Diagnostic Test (15 mins)',
      questions: res.questions,
      timeLimitMinutes: res.durationMinutes,
      testType: 'daily_test',
    });
  };

  const startWeeklyTest = async () => {
    const res = await api.getWeeklyTest();
    setActiveSession({
      title: res.testTitle,
      subtitle: 'Comprehensive 45-Minute Grand Placement Exam',
      questions: res.questions,
      timeLimitMinutes: res.durationMinutes,
      testType: 'weekly_test',
    });
  };

  const startSpeedChallenge = async () => {
    const res = await api.getAptitudeQuestions({ limit: 10 });
    setActiveSession({
      title: 'Rapid Fire Speed Challenge',
      subtitle: '10 Questions in 5 Minutes (High Speed & Precision)',
      questions: res.questions,
      timeLimitMinutes: 5,
      testType: 'speed_challenge',
    });
  };

  const startPracticeMistakes = () => {
    const wrongQuestions = mistakes
      .filter((m) => !m.resolved && m.question)
      .map((m) => m.question as AptitudeQuestion);

    if (wrongQuestions.length === 0) return;

    setActiveSession({
      title: 'Practice My Mistakes',
      subtitle: `Targeting ${wrongQuestions.length} previously missed questions`,
      questions: wrongQuestions,
      testType: 'mistake_retry',
    });
  };

  const handleAssessmentComplete = async (resultData: {
    answers: { questionId: string; userAnswer: number; timeSpentSec: number }[];
    timeSpentSec: number;
  }) => {
    if (!activeSession) return;
    try {
      await api.submitAptitude({
        type: activeSession.testType,
        answers: resultData.answers,
        timeSpentSec: resultData.timeSpentSec,
      });
      await loadAcademyData();
    } catch (err) {
      console.error('Error recording attempt:', err);
    }
  };

  // If a test or practice session is currently running, render the unified AssessmentEngine
  if (activeSession) {
    return (
      <AssessmentEngine
        title={activeSession.title}
        subtitle={activeSession.subtitle}
        questions={activeSession.questions}
        timeLimitMinutes={activeSession.timeLimitMinutes}
        testType={activeSession.testType}
        onComplete={handleAssessmentComplete}
        onExit={() => setActiveSession(null)}
      />
    );
  }

  const unresolvedMistakes = mistakes.filter((m) => !m.resolved);
  const avgAccuracy =
    attempts.length > 0
      ? Math.round(attempts.reduce((acc, a) => acc + a.accuracy, 0) / attempts.length)
      : 0;

  const filteredTopics =
    selectedCategoryTab === 'All'
      ? topics
      : topics.filter((t) => t.category === selectedCategoryTab);

  return (
    <div className="space-y-6">
      {/* Launch Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Practice */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl hover:border-indigo-500/50 transition flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="p-2 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800">
                <Target className="w-5 h-5" />
              </span>
              <span className="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded">
                Dynamic
              </span>
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Today's Aptitude Practice</h3>
            <p className="text-xs text-slate-400 mb-4">
              Adaptive mix of Quantitative, Logical Reasoning, and Verbal Ability based on your weak areas.
            </p>
          </div>
          <button
            onClick={startDailyPractice}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow transition"
          >
            <Play className="w-3.5 h-3.5" /> Start Today's Practice
          </button>
        </div>

        {/* Daily Test */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl hover:border-amber-500/50 transition flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="p-2 rounded-lg bg-amber-950 text-amber-400 border border-amber-800">
                <Calendar className="w-5 h-5" />
              </span>
              <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded">
                Timed 15m
              </span>
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Daily Placement Test</h3>
            <p className="text-xs text-slate-400 mb-4">
              10 high-impact placement questions benchmarked against Tier-1 campus hiring standards.
            </p>
          </div>
          <button
            onClick={startDailyTest}
            className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow transition"
          >
            <Play className="w-3.5 h-3.5" /> Launch Daily Test
          </button>
        </div>

        {/* Weekly Grand Test */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl hover:border-purple-500/50 transition flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="p-2 rounded-lg bg-purple-950 text-purple-400 border border-purple-800">
                <Award className="w-5 h-5" />
              </span>
              <span className="text-[10px] uppercase font-bold text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded">
                Full 45m
              </span>
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Weekly Placement Test</h3>
            <p className="text-xs text-slate-400 mb-4">
              Comprehensive full-length simulation with detailed section-by-section percentile analysis.
            </p>
          </div>
          <button
            onClick={startWeeklyTest}
            className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow transition"
          >
            <Play className="w-3.5 h-3.5" /> Start Weekly Test
          </button>
        </div>

        {/* Speed Challenge */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl hover:border-rose-500/50 transition flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="p-2 rounded-lg bg-rose-950 text-rose-400 border border-rose-800">
                <Zap className="w-5 h-5" />
              </span>
              <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded">
                Rapid 5m
              </span>
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Speed Challenge</h3>
            <p className="text-xs text-slate-400 mb-4">
              10 rapid-fire questions in 5 minutes. Trains fast mental calculations under pressure.
            </p>
          </div>
          <button
            onClick={startSpeedChallenge}
            className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow transition"
          >
            <Play className="w-3.5 h-3.5" /> Launch Speed Test
          </button>
        </div>
      </div>

      {/* Mistake Book Banner & Practice Mistakes */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-rose-950 text-rose-400 border border-rose-800/80">
            <BookX className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Aptitude Mistake Book</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 font-bold border border-rose-800">
                {unresolvedMistakes.length} Questions to Review
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Wrong, slow, or repeated mistakes are automatically saved for targeted concept re-testing.
            </p>
          </div>
        </div>

        <button
          onClick={startPracticeMistakes}
          disabled={unresolvedMistakes.length === 0}
          className="px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition disabled:opacity-40 flex items-center gap-2 shadow"
        >
          <RotateCcw className="w-4 h-4" /> Practice My Mistakes ({unresolvedMistakes.length})
        </button>
      </div>

      {/* Topics Catalog & Curriculum */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-white">Aptitude Curriculum & Weightage</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Original questions inspired by established placement standards.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {(['All', 'Quantitative', 'Logical Reasoning', 'Verbal Ability'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedCategoryTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  selectedCategoryTab === tab
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTopics.map((top) => (
            <div
              key={top.id}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-900 text-indigo-400 border border-slate-800">
                  {top.category}
                </span>
                <span className="text-[11px] text-amber-400 font-semibold">
                  Weight: {top.placementWeight}/10
                </span>
              </div>

              <h4 className="text-sm font-bold text-white">{top.name}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{top.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
