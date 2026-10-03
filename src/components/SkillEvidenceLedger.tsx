import React, { useState, useEffect } from 'react';
import { UserSkill, SkillEvidence, Skill, SkillCategory } from '../types';
import { api } from '../api';
import { ShieldCheck, Award, FileCheck2, Filter, Plus, ChevronRight, CheckCircle2 } from 'lucide-react';

export const SkillEvidenceLedger: React.FC = () => {
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [evidence, setEvidence] = useState<SkillEvidence[]>([]);
  const [catalogSkills, setCatalogSkills] = useState<Skill[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addSkillId, setAddSkillId] = useState('');
  const [addDeclaredScore, setAddDeclaredScore] = useState(60);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [skRes, evRes, catRes] = await Promise.all([
        api.getUserSkills(),
        api.getEvidence(),
        api.getAllSkills(),
      ]);
      setUserSkills(skRes.userSkills);
      setEvidence(evRes.evidence);
      setCatalogSkills(catRes.skills);
    } catch (err) {
      console.error('Failed to load skill evidence ledger:', err);
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addSkillId) return;
    setIsSaving(true);
    try {
      await api.updateUserSkill(addSkillId, addDeclaredScore);
      setShowAddModal(false);
      setAddSkillId('');
      await loadData();
    } catch (err) {
      console.error('Error adding skill:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const categories: string[] = [
    'All',
    'Programming',
    'DSA',
    'Software Engineering',
    'Web',
    'Database',
    'Data',
    'AI',
    'Emerging AI',
    'Cloud',
    'Cybersecurity',
  ];

  const filteredSkills = selectedCategory === 'All'
    ? userSkills
    : userSkills.filter((s) => s.category === selectedCategory);

  const verifiedCount = userSkills.filter((s) => s.status === 'verified').length;
  const assessedCount = userSkills.filter((s) => s.status === 'assessed').length;

  return (
    <div className="space-y-6">
      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <span className="text-xs uppercase font-semibold text-slate-400">Total Tracked Skills</span>
          <p className="text-2xl font-bold text-white mt-1">{userSkills.length}</p>
          <span className="text-xs text-slate-400 mt-1 block">Across full-stack & AI spectrum</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <span className="text-xs uppercase font-semibold text-emerald-400">Verified Skills</span>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{verifiedCount}</p>
          <span className="text-xs text-slate-400 mt-1 block">Supported by multi-factor evidence</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <span className="text-xs uppercase font-semibold text-indigo-400">Assessed Skills</span>
          <p className="text-2xl font-bold text-indigo-400 mt-1">{assessedCount}</p>
          <span className="text-xs text-slate-400 mt-1 block">Awaiting secondary project proof</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <span className="text-xs uppercase font-semibold text-amber-400">Evidence Records</span>
          <p className="text-2xl font-bold text-amber-300 mt-1">{evidence.length}</p>
          <span className="text-xs text-slate-400 mt-1 block">Immutable proof ledger entries</span>
        </div>
      </div>

      {/* Skills Matrix Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-400" /> Verified Skill Matrix
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified scores are earned exclusively through code execution, assessments, and projects.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
            >
              <Plus className="w-3.5 h-3.5" /> Declare New Skill
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 border-b border-slate-800">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        {filteredSkills.length === 0 ? (
          <div className="p-8 text-center text-slate-400 border border-dashed border-slate-800 rounded-xl">
            No skills in this category yet. Click "Declare New Skill" or complete an assessment to verify.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSkills.map((sk) => (
              <div
                key={sk.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-sm font-bold text-white">{sk.skillName}</h3>
                    <span className="text-[11px] text-slate-400">{sk.category}</span>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase ${
                      sk.status === 'verified'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : sk.status === 'assessed'
                        ? 'bg-indigo-950 text-indigo-400 border border-indigo-800'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {sk.status}
                  </span>
                </div>

                <div className="space-y-2 mt-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Verified Score</span>
                      <span className="font-bold text-white">{sk.verifiedScore}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          sk.verifiedScore >= 70
                            ? 'bg-emerald-500'
                            : sk.verifiedScore >= 40
                            ? 'bg-indigo-500'
                            : 'bg-slate-600'
                        }`}
                        style={{ width: `${sk.verifiedScore}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                    <span>Self-Declared: {sk.declaredScore}%</span>
                    <span className="font-medium text-slate-300">Level: {sk.level}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Proof Evidence Ledger */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-emerald-400" /> Evidence Proof Ledger
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {evidence.length} Verifiable Attestations
          </span>
        </div>

        {evidence.length === 0 ? (
          <div className="p-8 text-center text-slate-400 bg-slate-950 rounded-xl border border-slate-800">
            No evidence logged yet. Complete coding challenges or practical tests to generate your first proof.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase">
                  <th className="pb-3 font-semibold">Skill</th>
                  <th className="pb-3 font-semibold">Source & Activity</th>
                  <th className="pb-3 font-semibold">Score / Result</th>
                  <th className="pb-3 font-semibold">Attestation Details</th>
                  <th className="pb-3 font-semibold">Verified Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {evidence.map((ev) => (
                  <tr key={ev.id} className="hover:bg-slate-800/30">
                    <td className="py-3 font-medium text-white">{ev.skillName}</td>
                    <td className="py-3">
                      <span className="font-semibold text-slate-200 block">{ev.sourceTitle}</span>
                      <span className="text-[10px] text-slate-400 uppercase font-mono">{ev.sourceType}</span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded font-semibold ${
                          ev.percentage >= 70
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-indigo-950 text-indigo-400 border border-indigo-800'
                        }`}
                      >
                        {ev.score}/{ev.maxScore} ({ev.percentage}%)
                      </span>
                    </td>
                    <td className="py-3 text-slate-300 max-w-xs truncate">{ev.details}</td>
                    <td className="py-3 text-slate-400">{new Date(ev.timestamp).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Skill Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Declare New Skill</h3>
            <p className="text-xs text-slate-400 mb-4">
              Self-declared skills establish your initial benchmark. Real verification requires solving code challenges or passing practical assessments.
            </p>

            <form onSubmit={handleAddSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Select Skill from Catalog</label>
                <select
                  value={addSkillId}
                  onChange={(e) => setAddSkillId(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="">-- Choose Skill --</option>
                  {catalogSkills.map((sk) => (
                    <option key={sk.id} value={sk.id}>
                      {sk.name} ({sk.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Self-Estimated Confidence: {addDeclaredScore}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={addDeclaredScore}
                  onChange={(e) => setAddDeclaredScore(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !addSkillId}
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Add to Matrix'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
