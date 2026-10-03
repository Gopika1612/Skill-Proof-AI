import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Target,
  BookOpen,
  Award,
  Layers,
  HelpCircle,
} from 'lucide-react';

interface StudentOnboardingProps {
  onComplete: (needsDiagnostic: boolean) => void;
}

export const StudentOnboarding: React.FC<StudentOnboardingProps> = ({ onComplete }) => {
  const { user, completeOnboarding } = useAuth();
  const [step, setStep] = useState(1);

  // Step 1: Academic info
  const [name, setName] = useState(user?.name || '');
  const [college, setCollege] = useState(user?.college || '');
  const [department, setDepartment] = useState(user?.department || 'Computer Science & Engineering');
  const [academicYear, setAcademicYear] = useState(user?.academicYear || '1st Year');

  // Step 2: Skill level
  const [skillLevel, setSkillLevel] = useState<'zero' | 'beginner' | 'intermediate' | 'advanced' | 'unknown'>('beginner');

  // Step 3: Current skills
  const availableSkills = [
    'Python', 'Java', 'C', 'C++', 'JavaScript', 'HTML/CSS',
    'SQL', 'Git/GitHub', 'DSA', 'OOP', 'DBMS', 'Web Development',
    'Cloud', 'AI/ML', 'Cybersecurity', 'Other'
  ];
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Python', 'HTML/CSS']);

  // Step 4: Career Goal
  const careerOptions = [
    'Software Developer', 'Full Stack Developer', 'Data Analyst',
    'AI/ML Engineer', 'Data Scientist', 'Cloud Engineer',
    'Cybersecurity Engineer', 'DevOps Engineer', 'Mobile Developer',
    'UI/UX Designer', 'Other'
  ];
  const [careerGoal, setCareerGoal] = useState('Full Stack Developer');

  // Step 5: Placement Goal
  const [isPreparingPlacement, setIsPreparingPlacement] = useState<'yes' | 'not_yet' | 'unsure'>('yes');
  const placementAreas = [
    'Aptitude', 'Coding', 'DSA', 'SQL',
    'Technical MCQs', 'Communication', 'Technical Interview', 'HR Interview'
  ];
  const [selectedPlacementAreas, setSelectedPlacementAreas] = useState<string[]>(['Aptitude', 'Coding', 'DSA']);

  // Step 6: Learning Time
  const timeOptions = [
    { minutes: 15, label: '15 minutes / day', desc: 'Micro learning' },
    { minutes: 30, label: '30 minutes / day', desc: 'Steady progress' },
    { minutes: 60, label: '1 hour / day', desc: 'Recommended standard' },
    { minutes: 120, label: '2 hours / day', desc: 'Fast-track preparation' },
    { minutes: 150, label: 'More than 2 hours', desc: 'Intensive immersion' },
  ];
  const [selectedTimeMinutes, setSelectedTimeMinutes] = useState(45);

  // Step 7: Starting Point
  const [startingPoint, setStartingPoint] = useState<'zero' | 'standard'>('standard');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const togglePlacementArea = (area: string) => {
    setSelectedPlacementAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    const needsDiagnostic = skillLevel === 'unknown' || startingPoint !== 'zero';

    try {
      await completeOnboarding({
        name,
        college,
        department,
        academicYear,
        skillLevelConfidence: skillLevel,
        selectedSkills,
        careerGoal,
        targetRole: careerGoal,
        placementGoal: isPreparingPlacement === 'yes' ? selectedPlacementAreas.join(', ') : 'Skill Development',
        availableLearningTimeMinutes: selectedTimeMinutes,
        startingPoint,
      });

      onComplete(needsDiagnostic);
    } catch (err) {
      console.error('Error saving onboarding info:', err);
      onComplete(needsDiagnostic);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 selection:bg-indigo-500 selection:text-white">
      <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl relative">
        {/* Progress Bar & Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
            <span>Step {step} of 7</span>
            <span className="text-indigo-400">
              {step === 1 && 'Academic Profile'}
              {step === 2 && 'Skill Self-Assessment'}
              {step === 3 && 'Current Exposure'}
              {step === 4 && 'Career Trajectory'}
              {step === 5 && 'Placement Aim'}
              {step === 6 && 'Daily Schedule'}
              {step === 7 && 'Starting Blueprint'}
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-500 h-full transition-all duration-300"
              style={{ width: `${(step / 7) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: Academic Info */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-white">Academic Profile</h2>
              <p className="text-xs text-slate-400 mt-1">
                Tell us about your university journey so SkillProof can calibrate for your graduation timeline.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Your Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">College / University</label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="e.g. State Engineering Institute"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Department / Branch</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Computer Science, IT, Electronics"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Academic Year</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['1st Year', '2nd Year', '3rd Year', '4th Year'].map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setAcademicYear(yr)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition text-center ${
                      academicYear === yr
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {yr}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Current Skill Level */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-white">How would you describe your skills?</h2>
              <p className="text-xs text-slate-400 mt-1">
                Be completely candid. There are no wrong answers and we never judge.
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                { id: 'zero', icon: '🌱', label: 'I am completely new', desc: 'Never coded before. Ready to learn fundamentals from step zero.' },
                { id: 'beginner', icon: '🟢', label: 'Beginner', desc: 'Know basic syntax and concepts, but struggle writing programs independently.' },
                { id: 'intermediate', icon: '🟡', label: 'Intermediate', desc: 'Can build small scripts and simple projects; want to master DSA & architecture.' },
                { id: 'advanced', icon: '🔵', label: 'Advanced', desc: 'Comfortable with full-stack or systems; aiming for top-tier competitive hiring.' },
                { id: 'unknown', icon: '❓', label: 'I don’t know my level', desc: 'Take a friendly 5-minute diagnostic to determine where you stand.' },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => {
                    setSkillLevel(lvl.id as any);
                    if (lvl.id === 'zero') setStartingPoint('zero');
                  }}
                  className={`w-full p-3.5 rounded-xl border text-left transition flex items-start gap-3 ${
                    skillLevel === lvl.id
                      ? 'bg-indigo-950/80 border-indigo-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xl">{lvl.icon}</span>
                  <div>
                    <span className="text-xs font-bold block text-white">{lvl.label}</span>
                    <span className="text-[11px] text-slate-400 mt-0.5 leading-normal">{lvl.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Current Skills */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-white">Skills you've touched before</h2>
              <p className="text-xs text-slate-400 mt-1">
                Select any technologies you've encountered in coursework or projects (selecting does not assume mastery).
              </p>
            </div>

            <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto p-1">
              {availableSkills.map((sk) => {
                const selected = selectedSkills.includes(sk);
                return (
                  <button
                    key={sk}
                    type="button"
                    onClick={() => toggleSkill(sk)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                      selected
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {sk}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-500 italic">
              Don't worry if this list is short or empty—we build everything from the ground up.
            </p>
          </div>
        )}

        {/* STEP 4: Career Goal */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-white">What do you want to become?</h2>
              <p className="text-xs text-slate-400 mt-1">
                Your daily missions and projects will align with this target role.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto p-1">
              {careerOptions.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setCareerGoal(role)}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition ${
                    careerGoal === role
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: Placement Goal */}
        {step === 5 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-white">Are you preparing for campus placements?</h2>
              <p className="text-xs text-slate-400 mt-1">
                Helps us integrate company aptitude and interview rounds into your syllabus.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'yes', label: 'Yes, Actively' },
                { id: 'not_yet', label: 'Not Yet' },
                { id: 'unsure', label: "I'm Not Sure" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setIsPreparingPlacement(opt.id as any)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold text-center transition ${
                    isPreparingPlacement === opt.id
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {isPreparingPlacement === 'yes' && (
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  What domains do you want to strengthen most?
                </label>
                <div className="flex flex-wrap gap-2">
                  {placementAreas.map((area) => {
                    const sel = selectedPlacementAreas.includes(area);
                    return (
                      <button
                        key={area}
                        type="button"
                        onClick={() => togglePlacementArea(area)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                          sel
                            ? 'bg-indigo-950 border-indigo-500 text-indigo-200'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {area}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 6: Learning Time */}
        {step === 6 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-white">How much time can you learn each day?</h2>
              <p className="text-xs text-slate-400 mt-1">
                We design Today's Mission to fit comfortably within your daily availability.
              </p>
            </div>

            <div className="space-y-2">
              {timeOptions.map((to) => (
                <button
                  key={to.minutes}
                  type="button"
                  onClick={() => setSelectedTimeMinutes(to.minutes)}
                  className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between ${
                    selectedTimeMinutes === to.minutes
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs font-bold">{to.label}</span>
                  <span className={`text-[11px] ${selectedTimeMinutes === to.minutes ? 'text-indigo-200' : 'text-slate-500'}`}>
                    {to.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 7: Starting Point */}
        {step === 7 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-white">Choose Your Starting Point</h2>
              <p className="text-xs text-slate-400 mt-1">
                Select how you'd like SkillProof to initiate your curriculum.
              </p>
            </div>

            {/* Option 1: Start From Zero */}
            <div
              onClick={() => setStartingPoint('zero')}
              className={`p-4 rounded-xl border transition cursor-pointer flex items-start gap-3 ${
                startingPoint === 'zero'
                  ? 'bg-emerald-950/40 border-emerald-500 text-slate-200'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <span className="text-2xl mt-0.5">🌱</span>
              <div>
                <span className="text-xs font-bold text-emerald-400 block uppercase tracking-wide">
                  START FROM ZERO (Recommended for Beginners)
                </span>
                <h4 className="text-sm font-bold text-white mt-0.5">Fundamentals First</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  "Don't worry if you don't know programming. SkillProof AI will create a learning path from the absolute fundamentals."
                </p>
              </div>
            </div>

            {/* Option 2: Standard Path */}
            <div
              onClick={() => setStartingPoint('standard')}
              className={`p-4 rounded-xl border transition cursor-pointer flex items-start gap-3 ${
                startingPoint === 'standard'
                  ? 'bg-indigo-950/40 border-indigo-500 text-slate-200'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-1" />
              <div>
                <span className="text-xs font-bold text-indigo-400 block uppercase tracking-wide">
                  Adaptive Diagnostic
                </span>
                <h4 className="text-sm font-bold text-white mt-0.5">Calibrate With Quick Assessment</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Take a short 5-minute diagnostic to place you directly into your ideal level and skip concepts you already know.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-800">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => prev - 1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 7 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => prev + 1)}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg transition disabled:opacity-50"
            >
              {isSubmitting ? 'Generating Roadmap...' : 'Create My Learning Path'}
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
