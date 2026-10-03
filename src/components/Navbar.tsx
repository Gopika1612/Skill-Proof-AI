import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Settings, LogOut, Check, SlidersHorizontal, Users, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, loginAsDemo, updateProfile, logout } = useAuth();
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);

  // Settings form state
  const [targetRole, setTargetRole] = useState(user?.targetRole || '');
  const [careerGoal, setCareerGoal] = useState(user?.careerGoal || '');
  const [availableTime, setAvailableTime] = useState(user?.availableLearningTimeMinutes || 45);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({
        targetRole,
        careerGoal,
        availableLearningTimeMinutes: availableTime,
      });
      setShowSettingsModal(false);
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const openSettings = () => {
    if (user) {
      setTargetRole(user.targetRole || '');
      setCareerGoal(user.careerGoal || '');
      setAvailableTime(user.availableLearningTimeMinutes || 45);
    }
    setShowSettingsModal(true);
  };

  const roleLabelMap: Record<string, string> = {
    student: 'Student',
    employee: 'Employee',
    faculty: 'Faculty',
    company_admin: 'Company Admin',
    platform_admin: 'Platform Admin',
  };

  return (
    <>
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-4 md:px-8 py-3 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
              SkillProof <span className="text-indigo-400">AI</span>
            </span>
            <span className="text-[10px] text-slate-400 hidden sm:block">From Skills to Project Readiness</span>
          </div>
        </div>

        {/* User Account & Actions */}
        <div className="flex items-center gap-3">
          {/* User Info Badge */}
          {user && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-950 border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <div className="text-left">
                <span className="text-xs font-bold text-white block leading-tight">{user.name}</span>
                <span className="text-[10px] text-indigo-400 uppercase font-semibold">
                  {roleLabelMap[user.role] || user.role}
                </span>
              </div>
            </div>
          )}

          {/* Settings / Goal Calibration Button */}
          <button
            onClick={openSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition"
            title="Calibrate Goals & Schedule"
          >
            <Settings className="w-4 h-4 text-indigo-400" />
            <span className="hidden md:inline">Settings</span>
          </button>

          {/* Testing / Demo Persona Button (Moved into non-primary mode) */}
          <button
            onClick={() => setShowDemoModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-xs font-medium text-slate-400 hover:text-white border border-slate-800 transition"
            title="Demo Mode: Test different personas"
          >
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden lg:inline text-[11px]">Demo Mode</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="p-1.5 md:px-2.5 md:py-1.5 rounded-lg bg-slate-950 hover:bg-rose-950/60 hover:text-rose-300 border border-slate-800 hover:border-rose-900 text-slate-400 text-xs font-medium transition flex items-center gap-1"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline text-[11px]">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Profile Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">User Profile & Goal Calibration</h3>
            <p className="text-xs text-slate-400 mb-4">
              Your daily mission length and AI recommendation blueprint adapt dynamically to these settings.
            </p>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Role / Career Aim</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Full Stack & AI Engineer"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Objective</label>
                <input
                  type="text"
                  value={careerGoal}
                  onChange={(e) => setCareerGoal(e.target.value)}
                  placeholder="e.g. Crack Tier-1 Product Hiring or Internal Project Transition"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Daily Available Learning Window: {availableTime} minutes
                </label>
                <input
                  type="range"
                  min="15"
                  max="120"
                  step="15"
                  value={availableTime}
                  onChange={(e) => setAvailableTime(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                  <span>15m (Quick)</span>
                  <span>45m (Standard)</span>
                  <span>90m+ (Deep)</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition disabled:opacity-50"
                >
                  {isSaving ? 'Calibrating...' : 'Save & Calibrate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Demo Persona Switcher Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Demo Persona Sandbox</h3>
            <p className="text-xs text-slate-400 mb-4">
              Switch roles to evaluate how the curriculum, roadmap, and company dashboards dynamically adapt.
            </p>

            <div className="space-y-2 mb-6">
              {[
                { id: 'usr-student-1', name: 'Alex Morgan', role: 'Student (Placement Aspirant)', icon: '🎓' },
                { id: 'usr-emp-priya', name: 'Priya Sharma', role: 'Employee (Software Engineer)', icon: '👨‍💼' },
                { id: 'usr-admin-1', name: 'David Vance', role: 'Company Admin (Director)', icon: '🏢' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    loginAsDemo(p.id);
                    setShowDemoModal(false);
                  }}
                  className={`w-full p-3 rounded-xl border text-left transition flex items-center gap-3 ${
                    user?.id === p.id
                      ? 'bg-indigo-950 border-indigo-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xl">{p.icon}</span>
                  <div>
                    <span className="text-xs font-bold block">{p.name}</span>
                    <span className="text-[10px] text-slate-400">{p.role}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowDemoModal(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 text-xs font-medium text-slate-300 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
