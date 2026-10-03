import React, { useState, useEffect } from 'react';
import { CompanyProject, ProjectReadiness, User } from '../types';
import { api } from '../api';
import { Building2, Users, Briefcase, CheckCircle2, AlertTriangle, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export const CompanyReadiness: React.FC = () => {
  const [projects, setProjects] = useState<CompanyProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [readiness, setReadiness] = useState<ProjectReadiness | null>(null);
  const [employees, setEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompanyData();
  }, []);

  const loadCompanyData = async () => {
    setLoading(true);
    try {
      const [projRes, empRes] = await Promise.all([
        api.getCompanyProjects('org-cloudcorp'),
        api.getCompanyEmployees('org-cloudcorp'),
      ]);
      setProjects(projRes.projects);
      setEmployees(empRes.employees);
      if (projRes.projects.length > 0) {
        setSelectedProjectId(projRes.projects[0].id);
        fetchReadiness(projRes.projects[0].id);
      }
    } catch (err) {
      console.error('Error loading company data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReadiness = async (projId: string) => {
    try {
      const res = await api.getCompanyReadiness(projId);
      setReadiness(res);
    } catch (err) {
      console.error('Error fetching project readiness:', err);
    }
  };

  const handleSelectProject = (id: string) => {
    setSelectedProjectId(id);
    fetchReadiness(id);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-bold text-white">NextGen Cloud Corp — Project Readiness Engine</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real enterprise capability mapping: evidence-backed staffing, adaptive employee gap closing, and live readiness validation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-400">Target Project:</span>
          <select
            value={selectedProjectId}
            onChange={(e) => handleSelectProject(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {readiness && (
        <>
          {/* Executive Readiness Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-semibold uppercase text-indigo-400">Enterprise Readiness Report</span>
                <h3 className="text-lg font-bold text-white mt-0.5">{readiness.project.title}</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl">{readiness.project.description}</p>
              </div>

              <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-semibold block">Team Readiness</span>
                  <span
                    className={`text-2xl font-black ${
                      readiness.overallReadinessPercentage >= 70
                        ? 'text-emerald-400'
                        : readiness.overallReadinessPercentage >= 40
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {readiness.overallReadinessPercentage}%
                  </span>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-slate-800 flex items-center justify-center font-bold text-xs text-indigo-300">
                  {readiness.skillBreakdown.filter((s) => s.status === 'Ready').length}/
                  {readiness.skillBreakdown.length}
                </div>
              </div>
            </div>

            {/* Skill-by-Skill Evidence Breakdown */}
            <h4 className="text-xs font-semibold uppercase text-slate-400 mb-3">Required Technical Competencies & Evidence</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {readiness.skillBreakdown.map((sb) => (
                <div
                  key={sb.skillId}
                  className={`p-4 rounded-xl border ${
                    sb.status === 'Ready'
                      ? 'bg-emerald-950/20 border-emerald-900/50'
                      : sb.status === 'Developing'
                      ? 'bg-amber-950/20 border-amber-900/50'
                      : 'bg-rose-950/20 border-rose-900/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-white">{sb.skillName}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-bold uppercase flex items-center gap-1 ${
                        sb.status === 'Ready'
                          ? 'text-emerald-300 bg-emerald-950 border border-emerald-800'
                          : sb.status === 'Developing'
                          ? 'text-amber-300 bg-amber-950 border border-amber-800'
                          : 'text-rose-300 bg-rose-950 border border-rose-800'
                      }`}
                    >
                      {sb.status === 'Ready' && <CheckCircle2 className="w-3 h-3" />}
                      {sb.status === 'Developing' && <AlertTriangle className="w-3 h-3" />}
                      {sb.status === 'Gap' && <AlertCircle className="w-3 h-3" />}
                      {sb.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Team Score / Target:</span>
                      <span className="font-semibold text-white">
                        {sb.averageTeamScore}% / {sb.targetScore}%
                      </span>
                    </div>

                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          sb.status === 'Ready'
                            ? 'bg-emerald-500'
                            : sb.status === 'Developing'
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${Math.min(100, (sb.averageTeamScore / sb.targetScore) * 100)}%` }}
                      />
                    </div>

                    <p className="text-[11px] text-slate-400 italic pt-1">{sb.evidenceSummary}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Individual Employee Adaptive Training Section */}
            <div className="border-t border-slate-800 pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-400" /> Individual Employee Adaptation & Gap Training
                  </h4>
                  <p className="text-xs text-slate-400">
                    Employees A and B receive strictly different training sprints according to their verified evidence gaps.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {readiness.employeeAssessments.map((ea) => (
                  <div key={ea.employee.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h5 className="text-sm font-bold text-white">{ea.employee.name}</h5>
                        <span className="text-xs text-slate-400">
                          {ea.employee.experience || 'Software Engineer'} • {ea.employee.email}
                        </span>
                      </div>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-md font-bold ${
                          ea.readinessScore >= 80
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                        }`}
                      >
                        {ea.readinessScore}% Match
                      </span>
                    </div>

                    {/* Identified Gaps */}
                    <div className="mb-3">
                      <span className="text-[11px] uppercase font-semibold text-rose-400 block mb-1">
                        Specific Verified Gaps:
                      </span>
                      {ea.gaps.length === 0 ? (
                        <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> All required skills meet or exceed target threshold.
                        </span>
                      ) : (
                        <div className="space-y-1">
                          {ea.gaps.map((g, i) => (
                            <div key={i} className="text-xs text-slate-300 flex items-center gap-1.5">
                              <AlertCircle className="w-3 h-3 text-rose-400 shrink-0" /> {g}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Auto-Assigned Training Path */}
                    <div className="pt-2 border-t border-slate-900">
                      <span className="text-[11px] uppercase font-semibold text-indigo-400 block mb-1">
                        Assigned Personalized Upskilling Sprint:
                      </span>
                      {ea.trainingAssigned.length === 0 ? (
                        <span className="text-xs text-slate-400">Cleared for deployment.</span>
                      ) : (
                        <div className="space-y-1">
                          {ea.trainingAssigned.map((t, i) => (
                            <div key={i} className="text-xs text-indigo-300 flex items-center gap-1.5">
                              <ArrowRight className="w-3 h-3 text-indigo-400 shrink-0" /> {t}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
