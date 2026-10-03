import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { RecommendationPayload, UserSkill, SkillEvidence } from '../types';
import { CatchUpModal } from './CatchUpModal';
import { StartFromZeroModal } from './StartFromZeroModal';
import {
  Compass,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Play,
  ShieldCheck,
  Code2,
  Target,
  FolderGit2,
  RotateCcw,
  AlertTriangle,
  GraduationCap,
  Layers,
  ChevronRight,
  BookOpen,
  Briefcase,
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<RecommendationPayload | null>(null);
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [evidence, setEvidence] = useState<SkillEvidence[]>([]);
  const [loading, setLoading] = useState(true);
  const [missionDone, setMissionDone] = useState<Record<number, boolean>>({});

  // Modals
  const [showCatchUpModal, setShowCatchUpModal] = useState(false);
  const [showZeroModal, setShowZeroModal] = useState(false);
  const [catchUpActive, setCatchUpActive] = useState(user?.catchUpActive || false);

  useEffect(() => {
    loadDashboardData();
  }, [user?.id]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [recRes, skRes, evRes] = await Promise.all([
        api.getAiRecommendations(),
        api.getUserSkills(),
        api.getEvidence(),
      ]);
      setRecommendations(recRes);
      setUserSkills(skRes.userSkills);
      setEvidence(evRes.evidence);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleMissionItem = (idx: number) => {
    setMissionDone((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  // Academic year emphasis
  const academicYear = user?.academicYear || '1st Year';
  const getYearGuidance = (year: string) => {
    switch (year) {
      case '1st Year':
        return {
          title: '1st Year Foundation Track',
          focus: 'Programming Fundamentals • Aptitude Foundation • Communication • Git/GitHub • Mini Projects',
          tip: 'Build strong syntax intuition and problem-solving confidence early.',
        };
      case '2nd Year':
        return {
          title: '2nd Year Core Mastery Track',
          focus: 'Programming • Problem Solving • DSA • SQL • OOP • Capstones • Placement Foundation',
          tip: 'Transition from basic coding to data structures and database design.',
        };
      case '3rd Year':
        return {
          title: '3rd Year Placement & Systems Track',
          focus: 'Advanced DSA • DBMS • Operating Systems • Computer Networks • Development • Projects • Placement Prep',
          tip: 'Intensify mock tests and full-stack system architecture.',
        };
      case '4th Year':
      default:
        return {
          title: 'Final Year Placement Readiness Track',
          focus: 'Coding Tests • Aptitude • Technical Interviews • SQL • Core CS • Mock Interviews • Resume • Placement Readiness',
          tip: 'Focus on speed, interview communication, and end-to-end project defense.',
        };
    }
  };

  const yearInfo = getYearGuidance(academicYear);

  // 7-Stage Learning Path with single CURRENT highlighted stage
  const learningStages = [
    { id: 'basics', label: 'Programming Fundamentals', status: 'completed' },
    { id: 'logic', label: 'Problem Solving', status: 'completed' },
    { id: 'python', label: 'Python & Modular Code', status: 'current' }, // Currently active
    { id: 'dsa', label: 'DSA & Algorithms', status: 'upcoming' },
    { id: 'sql', label: 'SQL & Database', status: 'upcoming' },
    { id: 'projects', label: 'Projects & Capstones', status: 'upcoming' },
    { id: 'placement', label: 'Placement Preparation', status: 'upcoming' },
  ];

  return (
    <div className="space-y-6">
      {/* Modals */}
      <CatchUpModal
        isOpen={showCatchUpModal}
        onClose={() => setShowCatchUpModal(false)}
        onActivate={() => setCatchUpActive(true)}
      />
      <StartFromZeroModal
        isOpen={showZeroModal}
        onClose={() => setShowZeroModal(false)}
        onStartLesson={() => onNavigate('tutorials')}
      />

      {/* Top Greeting & Personalization */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xl md:text-2xl font-black text-white">
                Good Morning, {user?.name || 'Alex'} 👋
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-950 border border-indigo-700/60 text-indigo-300 text-[11px] font-bold">
                {academicYear}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300">
              <span>
                Your Goal: <strong className="text-white">{user?.targetRole || 'Software Developer'}</strong>
              </span>
              <span>•</span>
              <span>
                Daily Window: <strong className="text-indigo-400">{user?.availableLearningTimeMinutes || 30} mins</strong>
              </span>
              {user?.college && (
                <>
                  <span>•</span>
                  <span className="text-slate-400">{user.college}</span>
                </>
              )}
            </div>
          </div>

          {/* Quick Helper Triggers: Catch-Up & Start From Zero */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowZeroModal(true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-700/60 text-emerald-300 font-semibold text-xs transition flex items-center gap-1.5 shadow-sm"
            >
              <span>🌱</span> Start From Zero
            </button>
            <button
              onClick={() => setShowCatchUpModal(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-950/60 hover:bg-amber-900/60 border border-amber-700/60 text-amber-300 font-semibold text-xs transition flex items-center gap-1.5 shadow-sm"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              {catchUpActive ? 'Catch-Up Active' : "I'm Behind"}
            </button>
          </div>
        </div>

        {/* Academic Year Focus Strip */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <GraduationCap className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="font-semibold text-white">{yearInfo.title}:</span>
            <span className="text-slate-400 truncate max-w-xl">{yearInfo.focus}</span>
          </div>
          <span className="text-[11px] text-indigo-300/80 italic shrink-0">{yearInfo.tip}</span>
        </div>
      </div>

      {/* Main Content Grid: 8 Cols (Daily Action Engine) + 4 Cols (Progress & Placement) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* 🎯 TODAY'S MISSION CARD */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-lg font-bold text-white">TODAY'S MISSION</h2>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                    {user?.availableLearningTimeMinutes || 30} mins
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Complete these prioritized activities today to stay on track.
                </p>
              </div>

              <button
                onClick={() => {
                  const firstIncomplete = recommendations?.todayMission?.items?.find((_, i) => !missionDone[i]);
                  if (firstIncomplete) {
                    if (firstIncomplete.type === 'aptitude') onNavigate('aptitude');
                    else if (firstIncomplete.type === 'coding') onNavigate('coding');
                    else if (firstIncomplete.type === 'learn') onNavigate('tutorials');
                    else onNavigate('aptitude');
                  } else {
                    onNavigate('coding');
                  }
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-950/40 transition flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" /> Start Mission
              </button>
            </div>

            {/* Structured Mission Breakdown */}
            <div className="space-y-2.5">
              {[
                { type: 'learn', label: 'Learn', title: 'Python Functions & Scope', duration: '10 min', action: 'tutorials' },
                { type: 'coding', label: 'Practice', title: '3 beginner problems: Two Sum & Palindrome', duration: '10 min', action: 'coding' },
                { type: 'aptitude', label: 'Placement', title: '2 aptitude questions: Time & Work shortcuts', duration: '5 min', action: 'aptitude' },
                { type: 'quiz', label: 'Review', title: 'Quick quiz & mistake review', duration: '5 min', action: 'aptitude' },
              ].map((item, idx) => {
                const done = !!missionDone[idx];
                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border transition flex items-center justify-between gap-4 ${
                      done
                        ? 'bg-emerald-950/20 border-emerald-900/40 text-slate-400'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleMissionItem(idx)}
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition ${
                          done
                            ? 'bg-emerald-600 border-emerald-500 text-white'
                            : 'border-slate-700 bg-slate-900 text-transparent hover:border-slate-500'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-900">
                            {item.label}
                          </span>
                          <span className={`text-xs font-semibold ${done ? 'line-through text-slate-500' : 'text-white'}`}>
                            {item.title}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" /> {item.duration}
                      </span>
                      <button
                        onClick={() => onNavigate(item.action)}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-0.5"
                      >
                        Start <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 🧭 YOUR LEARNING PATH (Highlighting CURRENT Stage Only) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Compass className="w-4 h-4 text-indigo-400" /> YOUR LEARNING PATH
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Clear, progressive milestones. Only your current active stage is in focus.
                </p>
              </div>
              <span className="text-[11px] text-indigo-400 font-mono font-semibold">Stage 3 of 7</span>
            </div>

            <div className="space-y-2">
              {learningStages.map((st, i) => {
                const isCurrent = st.status === 'current';
                const isCompleted = st.status === 'completed';

                return (
                  <div
                    key={st.id}
                    className={`p-3 rounded-xl border flex items-center justify-between transition ${
                      isCurrent
                        ? 'bg-indigo-950/70 border-indigo-500 shadow-md shadow-indigo-950/40 text-white'
                        : isCompleted
                        ? 'bg-slate-950/40 border-slate-800/80 text-slate-400'
                        : 'bg-slate-950/20 border-slate-900 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                          isCompleted
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : isCurrent
                            ? 'bg-indigo-600 text-white ring-2 ring-indigo-400'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {isCompleted ? '✓' : i + 1}
                      </span>
                      <span className={`text-xs font-bold ${isCurrent ? 'text-white' : ''}`}>
                        {st.label}
                      </span>
                    </div>

                    <div>
                      {isCurrent ? (
                        <span className="text-[10px] uppercase font-bold text-indigo-300 bg-indigo-900/60 px-2 py-0.5 rounded border border-indigo-700">
                          Active Stage
                        </span>
                      ) : isCompleted ? (
                        <span className="text-[10px] text-emerald-400 font-semibold">Mastered</span>
                      ) : (
                        <span className="text-[10px] text-slate-600">Locked</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ⚠️ YOUR NEXT SKILL & ACTION CARD */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-purple-950/40 border border-indigo-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider block mb-1">
                Your Next Skill
              </span>
              <h4 className="text-base font-bold text-white">Python Functions & Return Values</h4>
              <p className="text-xs text-slate-300 mt-1 max-w-lg leading-relaxed">
                "You're ready to learn this next. Master arguments, scope, and clean functional decomposition."
              </p>
            </div>
            <button
              onClick={() => onNavigate('tutorials')}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition whitespace-nowrap flex items-center gap-1.5 self-start sm:self-auto"
            >
              Start Learning <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* 📊 YOUR SKILL MATRIX (Answering "What should I do next?") */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-400" /> YOUR SKILL MATRIX
              </h3>
              <button
                onClick={() => onNavigate('skills')}
                className="text-xs text-indigo-400 hover:underline font-semibold"
              >
                View Full
              </button>
            </div>

            <div className="space-y-3.5">
              {[
                { name: 'Python', score: 32, next: 'Learn Functions', action: 'tutorials', btnLabel: 'Start Lesson' },
                { name: 'DSA', score: 0, next: 'Linear Arrays', action: 'coding', btnLabel: 'Start' },
                { name: 'SQL', score: 15, next: 'SELECT + WHERE', action: 'coding', btnLabel: 'Practice Now' },
                { name: 'Aptitude', score: 48, next: 'Time & Work', action: 'aptitude', btnLabel: 'Practice' },
                { name: 'Git', score: 10, next: 'Commit & Branch', action: 'tutorials', btnLabel: 'Learn' },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-white">{item.name}</span>
                    <span className="text-indigo-400 font-bold">{item.score}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <span className="text-slate-400">Next: {item.next}</span>
                    <button
                      onClick={() => onNavigate(item.action)}
                      className="text-indigo-400 font-bold hover:underline"
                    >
                      [{item.btnLabel}]
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('skills')}
              className="w-full mt-4 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 transition"
            >
              View Full Skill Matrix
            </button>
          </div>

          {/* 💼 PLACEMENT PROGRESS */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-purple-400" /> PLACEMENT PROGRESS
              </span>
            </h3>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Aptitude</span>
                <p className="text-lg font-bold text-white mt-0.5">48%</p>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Coding</span>
                <p className="text-lg font-bold text-indigo-400 mt-0.5">22%</p>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Technical</span>
                <p className="text-lg font-bold text-slate-300 mt-0.5">10%</p>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Interview</span>
                <p className="text-lg font-bold text-slate-500 mt-0.5">0%</p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('placement')}
              className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow transition"
            >
              Practice Placement
            </button>
          </div>

          {/* 🛠 CURRENT PROJECT */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider block mb-1">
              Active Capstone
            </span>
            <h4 className="text-sm font-bold text-white">Student Management System</h4>
            <div className="mt-2 mb-4">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Milestone Progress</span>
                <span className="font-bold text-white">15%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '15%' }} />
              </div>
            </div>
            <button
              onClick={() => onNavigate('projects')}
              className="w-full py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              Continue Project <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
