import React, { useState, useEffect } from 'react';
import { Project, ProjectSubmission } from '../types';
import { api } from '../api';
import { FolderGit2, CheckCircle2, Circle, ExternalLink, Send, Award, Sparkles } from 'lucide-react';

export const ProjectLab: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [submissions, setSubmissions] = useState<ProjectSubmission[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [repoUrl, setRepoUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [pRes, sRes] = await Promise.all([api.getProjects(), api.getProjectSubmissions()]);
      setProjects(pRes.projects);
      setSubmissions(sRes.submissions);
      if (pRes.projects.length > 0) {
        selectProject(pRes.projects[0]);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
    }
  };

  const selectProject = (p: Project) => {
    setSelectedProject(p);
    // Initialize task completions from any existing submission
    const existing = submissions.find((s) => s.projectId === p.id);
    const initialTaskMap: Record<string, boolean> = {};
    p.tasks.forEach((t) => {
      initialTaskMap[t.id] = existing ? existing.completedTaskIds.includes(t.id) : false;
    });
    setCompletedTasks(initialTaskMap);
    setRepoUrl(existing?.repoUrl || '');
    setLiveUrl(existing?.liveUrl || '');
    setNotes(existing?.notes || '');
  };

  const toggleTask = (taskId: string) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    setIsSubmitting(true);
    setSuccessMessage(null);

    const completedIds = Object.keys(completedTasks).filter((id) => completedTasks[id]);
    try {
      const res = await api.submitProject({
        projectId: selectedProject.id,
        repoUrl,
        liveUrl,
        notes,
        completedTaskIds: completedIds,
      });

      setSuccessMessage(
        `Project evidence verified! ${res.submission.score}% score credited to your skills: ${selectedProject.requiredSkills
          .map((r) => r.skillName)
          .join(', ')}.`
      );

      const subRes = await api.getProjectSubmissions();
      setSubmissions(subRes.submissions);
    } catch (err: any) {
      console.error('Error submitting project evidence:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-semibold">{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-xs text-emerald-400 hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Project Selector Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <FolderGit2 className="w-5 h-5 text-indigo-400 shrink-0" />
        <span className="text-xs font-semibold uppercase text-slate-400">Available Capstones:</span>
        {projects.map((p) => {
          const isSelected = selectedProject?.id === p.id;
          const isVerified = submissions.some((s) => s.projectId === p.id && s.verified);
          return (
            <button
              key={p.id}
              onClick={() => selectProject(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {p.title}
              {isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            </button>
          );
        })}
      </div>

      {selectedProject && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Requirements & Tasks */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                  {selectedProject.domain}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded uppercase font-semibold ${
                    selectedProject.difficulty === 'Beginner'
                      ? 'text-emerald-400 bg-emerald-950/60'
                      : selectedProject.difficulty === 'Intermediate'
                      ? 'text-indigo-400 bg-indigo-950/60'
                      : 'text-purple-400 bg-purple-950/60'
                  }`}
                >
                  {selectedProject.difficulty}
                </span>
              </div>

              <h2 className="text-xl font-bold text-white mb-2">{selectedProject.title}</h2>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">{selectedProject.description}</p>

              <h4 className="text-xs uppercase font-semibold text-slate-400 mb-2">Required Skills Verified by this Project</h4>
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedProject.requiredSkills.map((req) => (
                  <span
                    key={req.skillId}
                    className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-xs font-medium text-slate-200"
                  >
                    {req.skillName} (min level: {req.minLevel}%)
                  </span>
                ))}
              </div>

              <h4 className="text-xs uppercase font-semibold text-slate-400 mb-3">Implementation Tasks & Deliverables</h4>
              <div className="space-y-3">
                {selectedProject.tasks.map((task) => {
                  const done = !!completedTasks[task.id];
                  return (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className={`p-3 rounded-xl border transition cursor-pointer flex items-start gap-3 ${
                        done
                          ? 'bg-emerald-950/20 border-emerald-900/60 text-slate-200'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <button type="button" className="mt-0.5 text-indigo-400">
                        {done ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Circle className="w-4 h-4 text-slate-500" />}
                      </button>
                      <div>
                        <h5 className={`text-xs font-bold ${done ? 'text-emerald-300 line-through' : 'text-white'}`}>
                          {task.title}
                        </h5>
                        <p className="text-xs text-slate-400 mt-0.5">{task.description}</p>
                        <span className="text-[10px] text-indigo-400 font-mono mt-1 block">
                          Proof prompt: {task.evidencePrompt}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Submission & Proof Form */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-400" /> Submit Project for Verification
              </h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                SkillProof verifies project evidence against your task checkoffs, GitHub commits, and architecture notes.
              </p>

              <form onSubmit={handleSubmitProof} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub / Code Repository URL</label>
                  <input
                    type="url"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/username/project"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Live Application URL (Optional)</label>
                  <input
                    type="url"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="https://my-app.cloudrun.app"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Implementation Notes & Architecture Summary
                  </label>
                  <textarea
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Describe how you handled state, error handling, security, and schema designs..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
                  />
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-400">
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Tasks Completed</span>
                    <span className="text-white">
                      {Object.values(completedTasks).filter(Boolean).length} / {selectedProject.tasks.length}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full transition-all"
                      style={{
                        width: `${(Object.values(completedTasks).filter(Boolean).length / selectedProject.tasks.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || Object.values(completedTasks).filter(Boolean).length === 0}
                  className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSubmitting ? 'Evaluating & Verifying...' : 'Attest & Log Evidence'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
