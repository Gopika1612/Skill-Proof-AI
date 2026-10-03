import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LandingPage } from './components/LandingPage';
import { AuthScreens } from './components/AuthScreens';
import { StudentOnboarding } from './components/StudentOnboarding';
import { InitialAssessment } from './components/InitialAssessment';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { SkillEvidenceLedger } from './components/SkillEvidenceLedger';
import { AptitudeAcademy } from './components/AptitudeAcademy';
import { CodeLab } from './components/CodeLab';
import { TutorialsView } from './components/TutorialsView';
import { ProjectLab } from './components/ProjectLab';
import { CompanyReadiness } from './components/CompanyReadiness';
import { PlacementHub } from './components/PlacementHub';
import { AiTutorDebugger } from './components/AiTutorDebugger';
import {
  Compass,
  Award,
  Target,
  Code2,
  Video,
  FolderGit2,
  Briefcase,
  Building2,
  BrainCircuit,
  Menu,
  X,
  Users,
} from 'lucide-react';

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

function AppRouter() {
  const { user, loading, activeScreen, setActiveScreen, loginAsDemo } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-400 font-medium">Loading SkillProof AI...</span>
        </div>
      </div>
    );
  }

  // 1. Landing Page
  if (activeScreen === 'landing') {
    return (
      <LandingPage
        onStartLearning={() => {
          setAuthMode('signup');
          setActiveScreen('signup');
        }}
        onExplore={() => {
          // Allow exploration with student demo profile
          loginAsDemo('usr-student-1');
        }}
        onLogin={() => {
          setAuthMode('login');
          setActiveScreen('login');
        }}
      />
    );
  }

  // 2. Authentication Screen (Login / Sign Up)
  if (activeScreen === 'login' || activeScreen === 'signup') {
    return (
      <AuthScreens
        initialMode={authMode}
        onSuccess={() => {
          // Handled in AuthContext (routes to onboarding or app)
        }}
        onSwitchMode={(mode) => setAuthMode(mode)}
        onCancel={() => setActiveScreen('landing')}
      />
    );
  }

  // 3. Student Onboarding Wizard
  if (activeScreen === 'onboarding') {
    return (
      <StudentOnboarding
        onComplete={(needsDiagnostic) => {
          if (needsDiagnostic) {
            setActiveScreen('assessment');
          } else {
            setActiveScreen('app');
          }
        }}
      />
    );
  }

  // 4. Initial Skill Assessment Diagnostic
  if (activeScreen === 'assessment') {
    return (
      <InitialAssessment
        onComplete={() => {
          setActiveScreen('app');
        }}
      />
    );
  }

  // 5. Main App Layout (Authenticated)
  return <MainLayout />;
}

function MainLayout() {
  const { user } = useAuth();
  const userRole = user?.role || 'student';

  // Default initial tab depends on role
  const defaultTab = userRole === 'company_admin' ? 'company' : 'dashboard';
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dynamic role-based navigation tabs
  const getNavItems = () => {
    if (userRole === 'company_admin') {
      return [
        { id: 'company', label: 'Company Readiness', icon: Building2 },
        { id: 'dashboard', label: 'Executive Dashboard', icon: Compass },
        { id: 'skills', label: 'Required Skills Matrix', icon: Award },
        { id: 'placement', label: 'Placement Benchmarks', icon: Briefcase },
        { id: 'ai_lab', label: 'AI Strategy Studio', icon: BrainCircuit },
      ];
    }

    if (userRole === 'faculty') {
      return [
        { id: 'dashboard', label: 'Department Overview', icon: Compass },
        { id: 'skills', label: 'Student Skill Matrix', icon: Award },
        { id: 'placement', label: 'Campus Placement Hub', icon: Briefcase },
        { id: 'tutorials', label: 'Curricula & Paths', icon: Video },
        { id: 'aptitude', label: 'Batch Diagnostics', icon: Target },
      ];
    }

    if (userRole === 'employee') {
      return [
        { id: 'dashboard', label: 'Upskill Dashboard', icon: Compass },
        { id: 'tutorials', label: 'Learning Roadmap', icon: Video },
        { id: 'skills', label: 'Skill Evidence Ledger', icon: Award },
        { id: 'coding', label: 'Code Lab & Sprints', icon: Code2 },
        { id: 'projects', label: 'Assigned Capstones', icon: FolderGit2 },
        { id: 'ai_lab', label: 'AI Mentor & Debugger', icon: BrainCircuit },
      ];
    }

    // Default: Student
    return [
      { id: 'dashboard', label: 'Dashboard & Mission', icon: Compass },
      { id: 'tutorials', label: 'My Roadmap', icon: Video },
      { id: 'skills', label: 'Skill Matrix', icon: Award },
      { id: 'coding', label: 'Coding Lab & Practice', icon: Code2 },
      { id: 'aptitude', label: 'Aptitude Academy', icon: Target },
      { id: 'projects', label: 'Projects & Capstones', icon: FolderGit2 },
      { id: 'placement', label: 'Placement Hub', icon: Briefcase },
      { id: 'ai_lab', label: 'AI Mentor & Debugger', icon: BrainCircuit },
    ];
  };

  const navigationItems = getNavItems();

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
          <span className="text-xs font-semibold text-slate-300">
            {navigationItems.find((n) => n.id === activeTab)?.label || 'Navigation'}
          </span>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Sidebar */}
        <aside
          className={`w-full md:w-64 bg-slate-900/60 border-r border-slate-800/80 p-4 shrink-0 transition-all ${
            mobileMenuOpen ? 'block' : 'hidden md:block'
          }`}
        >
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-3 pb-2 block">
              {userRole === 'company_admin'
                ? 'Enterprise Suite'
                : userRole === 'faculty'
                ? 'Faculty Workspace'
                : userRole === 'employee'
                ? 'Professional Growth'
                : 'Student Journey'}
            </span>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800/80 px-3">
            <div className="text-[11px] text-slate-500 font-medium">SkillProof Engine</div>
            <div className="text-[10px] text-slate-400 mt-1">
              Assess → Identify → Learn → Practice → Build → Prove → Adapt
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && <DashboardView onNavigate={setActiveTab} />}
          {activeTab === 'skills' && <SkillEvidenceLedger />}
          {activeTab === 'aptitude' && <AptitudeAcademy />}
          {activeTab === 'coding' && <CodeLab />}
          {activeTab === 'tutorials' && <TutorialsView />}
          {activeTab === 'projects' && <ProjectLab />}
          {activeTab === 'placement' && <PlacementHub />}
          {activeTab === 'company' && <CompanyReadiness />}
          {activeTab === 'ai_lab' && <AiTutorDebugger />}
        </main>
      </div>
    </div>
  );
}
