import React, { useState, useEffect } from 'react';
import { Tutorial } from '../types';
import { api } from '../api';
import { Video, CheckCircle2, Clock, BookOpen, ExternalLink, Play } from 'lucide-react';

export const TutorialsView: React.FC = () => {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [isCompleting, setIsCompleting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    loadTutorials();
  }, []);

  const loadTutorials = async () => {
    try {
      const res = await api.getTutorials();
      setTutorials(res.tutorials);
      if (res.tutorials.length > 0) {
        setSelectedTutorial(res.tutorials[0]);
      }
    } catch (err) {
      console.error('Failed to load tutorials:', err);
    }
  };

  const handleComplete = async (tut: Tutorial) => {
    setIsCompleting(true);
    try {
      await api.completeTutorial(tut.id);
      setCompletedIds((prev) => new Set([...prev, tut.id]));
      setToast(`Course completed! 100% mastery evidence logged for ${tut.skillName}.`);
      setTimeout(() => setToast(null), 5000);
    } catch (err) {
      console.error('Error completing tutorial:', err);
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-semibold">{toast}</span>
          </div>
          <button onClick={() => setToast(null)} className="text-xs text-emerald-400 hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Selector Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <Video className="w-5 h-5 text-indigo-400 shrink-0" />
        <span className="text-xs font-semibold uppercase text-slate-400">Curated Video Mastery:</span>
        {tutorials.map((t) => {
          const isSelected = selectedTutorial?.id === t.id;
          const isDone = completedIds.has(t.id);
          return (
            <button
              key={t.id}
              onClick={() => setSelectedTutorial(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {t.title}
              {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            </button>
          );
        })}
      </div>

      {selectedTutorial && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Video Player & Summary (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden p-4">
              <div className="aspect-video w-full rounded-lg overflow-hidden bg-black mb-4">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${selectedTutorial.youtubeId}`}
                  title={selectedTutorial.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                  {selectedTutorial.skillName}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5 text-slate-500" /> {selectedTutorial.durationMinutes} mins
                </span>
              </div>

              <h2 className="text-lg font-bold text-white mb-2">{selectedTutorial.title}</h2>
            </div>
          </div>

          {/* Objectives, Takeaways & Attestation (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400" /> Core Learning Objectives
              </h3>
              <ul className="space-y-2 mb-6">
                {selectedTutorial.objectives.map((obj, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>

              <h3 className="text-base font-bold text-white mb-3">Key Technical Takeaways</h3>
              <div className="space-y-2 mb-6">
                {selectedTutorial.keyTakeaways.map((kt, i) => (
                  <div key={i} className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300">
                    {kt}
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleComplete(selectedTutorial)}
                disabled={isCompleting || completedIds.has(selectedTutorial.id)}
                className={`w-full py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 shadow ${
                  completedIds.has(selectedTutorial.id)
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800 cursor-default'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {completedIds.has(selectedTutorial.id)
                  ? 'Completed & Attested'
                  : isCompleting
                  ? 'Verifying...'
                  : 'Mark Course Completed & Log Proof'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
