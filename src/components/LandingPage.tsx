import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  ArrowRight,
  Sparkles,
  BookOpen,
  Briefcase,
  Building2,
  Code2,
  Target,
  Award,
  CheckCircle2,
  GraduationCap,
  Users,
  Compass,
  Laptop,
  Play,
} from 'lucide-react';

interface LandingPageProps {
  onStartLearning: () => void;
  onExplore: () => void;
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartLearning,
  onExplore,
  onLogin,
}) => {
  const { loginAsDemo } = useAuth();
  const [activeTab, setActiveTab] = useState<'students' | 'colleges' | 'companies'>('students');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
              SkillProof <span className="text-indigo-400">AI</span>
            </span>
            <span className="text-[10px] text-slate-400 hidden sm:block">From Skills to Project Readiness</span>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-300">
          <a href="#how-it-works" className="hover:text-white transition">How It Works</a>
          <a href="#learning-paths" className="hover:text-white transition">Learning Paths</a>
          <a href="#placement" className="hover:text-white transition">Placement</a>
          <a href="#for-colleges" className="hover:text-white transition">For Colleges</a>
          <a href="#for-companies" className="hover:text-white transition">For Companies</a>
          <a href="#about" className="hover:text-white transition">About</a>
        </nav>

        {/* Top-Right Auth Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onLogin}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800 transition"
          >
            Login
          </button>
          <button
            onClick={onStartLearning}
            className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition flex items-center gap-1.5"
          >
            Sign Up <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 md:px-8 pt-16 pb-20 max-w-6xl mx-auto w-full text-center flex flex-col items-center">
        {/* Subtle glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          Evidence-Backed Adaptive Learning Platform
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-4 max-w-4xl leading-tight">
          From Skills to <span className="bg-gradient-to-r from-indigo-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">Project Readiness</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mb-8 leading-relaxed font-normal">
          Your AI-powered learning journey from beginner to job-ready. Adaptive skill assessments, real code verification, placement aptitude, and verified capstone proof.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 mb-14">
          <button
            onClick={onStartLearning}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition flex items-center gap-2 group"
          >
            Start Learning Free <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
          </button>
          <button
            onClick={onExplore}
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold text-sm transition flex items-center gap-2"
          >
            <Compass className="w-4 h-4 text-indigo-400" /> Explore SkillProof
          </button>
        </div>

        {/* Quick Value Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-4xl p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
          <div className="p-3 text-center">
            <div className="text-xl sm:text-2xl font-black text-white">45+</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Verified Tech Skills</div>
          </div>
          <div className="p-3 text-center border-l border-slate-800">
            <div className="text-xl sm:text-2xl font-black text-indigo-400">100%</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Real Code Execution</div>
          </div>
          <div className="p-3 text-center border-l border-slate-800">
            <div className="text-xl sm:text-2xl font-black text-emerald-400">3-Tier</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Aptitude & Placement</div>
          </div>
          <div className="p-3 text-center border-l border-slate-800">
            <div className="text-xl sm:text-2xl font-black text-purple-400">0% Fake</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Proof-Backed Matrix</div>
          </div>
        </div>
      </section>

      {/* "Start From Zero" Callout Banner */}
      <section className="px-4 md:px-8 py-6 max-w-6xl mx-auto w-full">
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-emerald-800/40 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-400 shrink-0 mt-1">
              <span className="text-2xl">🌱</span>
            </div>
            <div>
              <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
                Beginner Friendly Guarantee
              </span>
              <h3 className="text-lg md:text-xl font-bold text-white mt-0.5">
                Starting from Complete Zero? That's Exactly Where We Shine.
              </h3>
              <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Never written a line of code? SkillProof AI creates a gentle, step-by-step roadmap from variables and loops to real problem solving—with zero intimidation.
              </p>
            </div>
          </div>
          <button
            onClick={onStartLearning}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs whitespace-nowrap shadow-lg shadow-emerald-950/50 transition"
          >
            Start From Scratch
          </button>
        </div>
      </section>

      {/* The 7-Step Core Loop Section */}
      <section id="how-it-works" className="px-4 md:px-8 py-16 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold text-indigo-400 tracking-wider">The SkillProof Loop</span>
          <h2 className="text-2xl md:text-3xl font-black text-white mt-1">
            How You Go From Basics to Verified Readiness
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-2">
            No endless unverified video watching. Every concept is tested, practiced, and proven with immutable evidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-2.5">
          {[
            { step: '01', title: 'ASSESS', desc: 'Quick friendly diagnostic identifies your exact starting point' },
            { step: '02', title: 'IDENTIFY', desc: 'AI highlights critical missing fundamentals and skill gaps' },
            { step: '03', title: 'LEARN', desc: 'Curated masterclasses with concrete objectives and takeaways' },
            { step: '04', title: 'PRACTICE', desc: 'Daily adaptive aptitude and live code sandboxes' },
            { step: '05', title: 'BUILD', desc: 'Production capstones with real schema and architecture tasks' },
            { step: '06', title: 'PROVE', desc: 'Immutable verified ledger logs every execution pass and test' },
            { step: '07', title: 'ADAPT', desc: 'Dynamic recalibration adjusting daily missions as you grow' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center flex flex-col justify-between hover:border-indigo-500/50 transition"
            >
              <div>
                <span className="text-[10px] font-mono font-bold text-indigo-400 block mb-1">{item.step}</span>
                <h4 className="text-xs font-black text-white mb-1.5">{item.title}</h4>
                <p className="text-[11px] text-slate-400 leading-normal">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Target Audiences: Students / Colleges / Companies */}
      <section id="learning-paths" className="px-4 md:px-8 py-12 max-w-6xl mx-auto w-full">
        <div className="flex justify-center gap-2 mb-8">
          {(['students', 'colleges', 'companies'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              For {tab === 'students' ? 'Students & Job Seekers' : tab}
            </button>
          ))}
        </div>

        {activeTab === 'students' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-950 text-indigo-400 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Daily Aptitude Academy</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Quantitative, Logical Reasoning, and Verbal Ability tests. Automatic Mistake Book captures weak topics for targeted retry until 100% mastery.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-950 text-indigo-400 flex items-center justify-center">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Real Coding Lab</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Native Node.js, Python 3.10, and SQLite execution engines running unit tests against real test cases with millisecond execution profiling.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-950 text-indigo-400 flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Placement & Interview Hub</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Combined full-length mock examinations (Aptitude, OS, DBMS, SQL, DSA) with interactive technical interview simulators.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'colleges' && (
          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="max-w-2xl">
              <span className="text-xs uppercase font-bold text-indigo-400">Institutional Excellence</span>
              <h3 className="text-xl font-bold text-white mt-1 mb-2">
                Real-Time Department Skill Mapping & Placement Readiness
              </h3>
              <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                Empower your faculty with live analytics on student competency, syllabus benchmark attainment, and automated placement mock diagnostics without subjective grading bias.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Automated 1st to 4th Year Placement Roadmaps
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> NIRF & Accreditation Attestation Evidence
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Departmental Skill-Gap Detection
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Campus Mock Drive Simulators
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'companies' && (
          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="max-w-2xl">
              <span className="text-xs uppercase font-bold text-indigo-400">Enterprise Engineering</span>
              <h3 className="text-xl font-bold text-white mt-1 mb-2">
                Evidence-Based Project Staffing & Capability Validation
              </h3>
              <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                Stop relying on resumes. Define enterprise project requirements (React, Node, RAG, Docker), identify individual employee gaps, and assign tailored upskilling sprints with verified project readiness ratings.
              </p>
              <button
                onClick={() => loginAsDemo('usr-admin-1')}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition"
              >
                Explore Company Admin Mode
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Demo Persona Access Footer */}
      <section className="px-4 md:px-8 py-8 max-w-6xl mx-auto w-full border-t border-slate-800/80">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-white block">Evaluating SkillProof AI?</span>
            <span className="text-[11px] text-slate-400">
              Quickly preview the platform with pre-configured demo personas:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => loginAsDemo('usr-student-1')}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-200 transition"
            >
              🎓 Alex (Student)
            </button>
            <button
              onClick={() => loginAsDemo('usr-emp-priya')}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-200 transition"
            >
              👨‍💼 Priya (Employee)
            </button>
            <button
              onClick={() => loginAsDemo('usr-admin-1')}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-200 transition"
            >
              🏢 David (Company Admin)
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950 px-4 md:px-8 py-8 text-center text-xs text-slate-500">
        <p>© 2026 SkillProof AI. From Skills to Project Readiness. All rights reserved.</p>
      </footer>
    </div>
  );
};
