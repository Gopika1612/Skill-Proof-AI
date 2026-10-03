import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { db } from './server/db.js';
import { User } from './server/types.js';
import { runCode } from './server/codeRunner.js';
import { generateSkillGapAndRecommendations, askAiTutor, askAiDebugger } from './server/geminiService.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper middleware to extract user (from header or fallback to demo student for mock APIs)
function getReqUser(req: Request): User | null {
  const userId = req.headers['x-user-id'] as string;
  if (userId && userId.trim() !== '') {
    const found = db.findUserById(userId);
    if (found) return found;
  }
  return null;
}

function getReqUserOrDemo(req: Request): User {
  return getReqUser(req) || db.findUserById('usr-student-1') || db.findUserByEmail('alex@skillproof.ai')!;
}

// ================= AUTH ROUTES =================
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { email, name, password, role, targetRole, careerGoal, availableLearningTimeMinutes, college, department, academicYear, startingPoint, skillLevelConfidence } = req.body;
  if (!email || !name) {
    return res.status(400).json({ error: 'Email and Name are required' });
  }

  const existing = db.findUserByEmail(email);
  if (existing) {
    return res.status(400).json({ error: 'User with this email already exists' });
  }

  const user = db.createUser({
    email,
    name,
    password: password || 'password123',
    role: role || 'student',
    college,
    department,
    academicYear: academicYear || '1st Year',
    targetRole: targetRole || 'Software Developer',
    careerGoal: careerGoal || 'Placement & Practical Mastery',
    availableLearningTimeMinutes: Number(availableLearningTimeMinutes) || 30,
    startingPoint: startingPoint || 'standard',
    skillLevelConfidence: skillLevelConfidence || 'beginner',
    onboardingCompleted: false,
  });

  return res.json({ user });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = db.findUserByEmail(email);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  if (password && user.password && user.password !== password) {
    return res.status(401).json({ error: 'Invalid password' });
  }
  return res.json({ user });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const user = getReqUser(req);
  return res.json({ user });
});

app.put('/api/auth/profile', (req: Request, res: Response) => {
  const user = getReqUserOrDemo(req);
  const updated = db.updateUserProfile(user.id, req.body);
  return res.json({ user: updated });
});

// ================= SKILLS & EVIDENCE ROUTES =================
app.get('/api/skills', (_req: Request, res: Response) => {
  return res.json({ skills: db.getAllSkills() });
});

app.get('/api/skills/user', (req: Request, res: Response) => {
  const user = getReqUserOrDemo(req);
  const userSkills = db.getUserSkills(user.id);
  return res.json({ userSkills });
});

app.post('/api/skills/user', (req: Request, res: Response) => {
  const user = getReqUserOrDemo(req);
  const { skillId, declaredScore } = req.body;
  if (!skillId) return res.status(400).json({ error: 'Skill ID required' });
  const updated = db.addOrUpdateUserSkill(user.id, skillId, Number(declaredScore) || 50);
  return res.json({ userSkill: updated });
});

app.get('/api/skills/evidence', (req: Request, res: Response) => {
  const user = getReqUserOrDemo(req);
  const evidence = db.getUserEvidence(user.id);
  return res.json({ evidence });
});

// ================= APTITUDE ACADEMY ROUTES =================
app.get('/api/aptitude/topics', (_req: Request, res: Response) => {
  return res.json({ topics: db.getAptitudeTopics() });
});

app.get('/api/aptitude/questions', (req: Request, res: Response) => {
  const { topicId, category, difficulty, limit } = req.query;
  const questions = db.getAptitudeQuestions({
    topicId: topicId as string,
    category: category as string,
    difficulty: difficulty as string,
    limit: limit ? Number(limit) : undefined,
  });
  return res.json({ questions });
});

app.get('/api/aptitude/daily-practice', (req: Request, res: Response) => {
  const user = getReqUserOrDemo(req);
  const session = db.generateDailyPracticeSession(user.id);
  return res.json(session);
});

app.get('/api/aptitude/daily-test', (req: Request, res: Response) => {
  const user = getReqUserOrDemo(req);
  const session = db.generateDailyPracticeSession(user.id);
  return res.json({
    testTitle: "Today's Placement Aptitude Test",
    durationMinutes: 15,
    questions: session.questions.slice(0, 10),
  });
});

app.get('/api/aptitude/weekly-test', (_req: Request, res: Response) => {
  // 50 questions or representative placement exam
  const all = db.getAptitudeQuestions();
  return res.json({
    testTitle: 'Weekly Grand Placement Mock Exam',
    durationMinutes: 45,
    totalQuestions: all.length,
    questions: all,
  });
});

app.post('/api/aptitude/submit', (req: Request, res: Response) => {
  const user = getReqUserOrDemo(req);
  const { type, answers, timeSpentSec } = req.body;
  if (!answers || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'Answers array required' });
  }

  let correctCount = 0;
  const topicMap: Record<string, { total: number; correct: number; accuracy: number }> = {};
  const processedAnswers = answers.map((ans: { questionId: string; userAnswer: number; timeSpentSec?: number }) => {
    const q = db.getAptitudeQuestions().find((item) => item.id === ans.questionId);
    const isCorrect = q ? q.correctAnswer === ans.userAnswer : false;
    if (isCorrect) correctCount++;

    const topicName = q?.topicName || 'General';
    if (!topicMap[topicName]) topicMap[topicName] = { total: 0, correct: 0, accuracy: 0 };
    topicMap[topicName].total++;
    if (isCorrect) topicMap[topicName].correct++;

    return {
      questionId: ans.questionId,
      userAnswer: ans.userAnswer,
      isCorrect,
      timeSpentSec: ans.timeSpentSec || 30,
    };
  });

  Object.keys(topicMap).forEach((t) => {
    topicMap[t].accuracy = Math.round((topicMap[t].correct / topicMap[t].total) * 100);
  });

  const accuracy = Math.round((correctCount / answers.length) * 100);
  const attempt = db.recordAptitudeAttempt({
    userId: user.id,
    type: type || 'daily_practice',
    score: correctCount,
    totalQuestions: answers.length,
    accuracy,
    timeSpentSec: Number(timeSpentSec) || 300,
    answers: processedAnswers,
    topicBreakdown: topicMap,
  });

  return res.json({ attempt });
});

app.get('/api/aptitude/attempts', (req: Request, res: Response) => {
  const user = getReqUserOrDemo(req);
  const attempts = db.getUserAptitudeAttempts(user.id);
  return res.json({ attempts });
});

app.get('/api/aptitude/mistakes', (req: Request, res: Response) => {
  const user = getReqUserOrDemo(req);
  const mistakes = db.getUserMistakes(user.id);
  return res.json({ mistakes });
});

app.post('/api/aptitude/mistakes/:id/resolve', (req: Request, res: Response) => {
  const user = getReqUserOrDemo(req);
  db.resolveMistake(user.id, req.params.id);
  return res.json({ success: true });
});

// ================= CODING LAB ROUTES =================
app.get('/api/coding/challenges', (_req: Request, res: Response) => {
  return res.json({ challenges: db.getCodingChallenges() });
});

app.get('/api/coding/challenges/:id', (req: Request, res: Response) => {
  const challenge = db.getCodingChallengeById(req.params.id);
  if (!challenge) return res.status(404).json({ error: 'Challenge not found' });
  return res.json({ challenge });
});

app.post('/api/coding/run', async (req: Request, res: Response) => {
  const { challengeId, language, code } = req.body;
  const challenge = db.getCodingChallengeById(challengeId);
  if (!challenge) return res.status(404).json({ error: 'Challenge not found' });

  try {
    const result = await runCode(language, code, challenge.testCases, challenge.sqlSchema);
    return res.json({ result });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Execution error' });
  }
});

app.post('/api/coding/submit', async (req: Request, res: Response) => {
  const user = getReqUserOrDemo(req);
  const { challengeId, language, code } = req.body;
  const challenge = db.getCodingChallengeById(challengeId);
  if (!challenge) return res.status(404).json({ error: 'Challenge not found' });

  const runResult = await runCode(language, code, challenge.testCases, challenge.sqlSchema);
  const submission = db.recordCodingSubmission({
    userId: user.id,
    challengeId: challenge.id,
    challengeTitle: challenge.title,
    language,
    code,
    status: runResult.status,
    passedTests: runResult.passedTests,
    totalTests: runResult.totalTests,
    score: runResult.score,
    executionTimeMs: runResult.executionTimeMs,
    output: runResult.output,
    error: runResult.error,
  });

  return res.json({ submission, runResult });
});

app.get('/api/coding/submissions', (req: Request, res: Response) => {
  const user = getReqUserOrDemo(req);
  const submissions = db.getUserCodingSubmissions(user.id);
  return res.json({ submissions });
});

// ================= TUTORIALS & PROJECTS ROUTES =================
app.get('/api/tutorials', (_req: Request, res: Response) => {
  return res.json({ tutorials: db.getTutorials() });
});

app.post('/api/tutorials/:id/complete', (req: Request, res: Response) => {
  const user = getReqUserOrDemo(req);
  const tut = db.getTutorials().find((t) => t.id === req.params.id);
  if (!tut) return res.status(404).json({ error: 'Tutorial not found' });

  const evidence = db.recordSkillEvidence({
    userId: user.id,
    skillId: tut.skillId,
    skillName: tut.skillName,
    sourceType: 'assessment',
    sourceTitle: `Completed Course: ${tut.title}`,
    score: 100,
    maxScore: 100,
    percentage: 100,
    details: `Finished all learning objectives and key takeaways for ${tut.skillName}.`,
  });

  return res.json({ evidence });
});

app.get('/api/projects', (_req: Request, res: Response) => {
  return res.json({ projects: db.getProjects() });
});

app.post('/api/projects/submit', (req: Request, res: Response) => {
  const user = getReqUserOrDemo(req);
  const { projectId, repoUrl, liveUrl, notes, completedTaskIds } = req.body;
  const project = db.getProjects().find((p) => p.id === projectId);
  if (!project) return res.status(404).json({ error: 'Project not found' });

  const score = Math.round(((completedTaskIds?.length || 0) / project.tasks.length) * 100);
  const submission = db.submitProject({
    userId: user.id,
    projectId: project.id,
    projectTitle: project.title,
    repoUrl: repoUrl || '',
    liveUrl: liveUrl || '',
    notes: notes || 'Submitted for skill proof verification.',
    completedTaskIds: completedTaskIds || [],
    verified: score >= 65,
    score,
    feedback: score >= 65 ? 'Project successfully verified and credited.' : 'Incomplete tasks. Complete all tasks to earn verification.',
  });

  return res.json({ submission });
});

app.get('/api/projects/submissions', (req: Request, res: Response) => {
  const user = getReqUserOrDemo(req);
  const submissions = db.getUserProjectSubmissions(user.id);
  return res.json({ submissions });
});

// ================= COMPANY & READINESS ROUTES =================
app.get('/api/company/orgs', (_req: Request, res: Response) => {
  return res.json({ orgs: db.getCompanyOrgs() });
});

app.get('/api/company/projects', (req: Request, res: Response) => {
  const orgId = (req.query.orgId as string) || 'org-cloudcorp';
  return res.json({ projects: db.getCompanyProjects(orgId) });
});

app.post('/api/company/projects', (req: Request, res: Response) => {
  const project = db.createCompanyProject(req.body);
  return res.json({ project });
});

app.get('/api/company/employees', (req: Request, res: Response) => {
  const orgId = (req.query.orgId as string) || 'org-cloudcorp';
  return res.json({ employees: db.getCompanyEmployees(orgId) });
});

app.get('/api/company/readiness/:projectId', (req: Request, res: Response) => {
  const readiness = db.computeProjectReadiness(req.params.projectId);
  if (!readiness) return res.status(404).json({ error: 'Project not found' });
  return res.json(readiness);
});

// ================= PLACEMENT HUB ROUTES =================
app.get('/api/placement/questions', (_req: Request, res: Response) => {
  return res.json({ questions: db.getPlacementQuestions() });
});

app.post('/api/placement/mock-submit', (req: Request, res: Response) => {
  const user = getReqUserOrDemo(req);
  const { answers, timeSpentSec } = req.body;
  const questions = db.getPlacementQuestions();

  let correctCount = 0;
  const breakdown: Record<string, { total: number; correct: number }> = {};

  (answers || []).forEach((ans: { questionId: string; userAnswer: number }) => {
    const q = questions.find((item) => item.id === ans.questionId);
    if (!q) return;
    const isCorrect = q.correctAnswer === ans.userAnswer;
    if (isCorrect) correctCount++;

    if (!breakdown[q.section]) breakdown[q.section] = { total: 0, correct: 0 };
    breakdown[q.section].total++;
    if (isCorrect) breakdown[q.section].correct++;
  });

  const accuracy = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

  db.recordSkillEvidence({
    userId: user.id,
    skillId: 'se-system-design',
    skillName: 'Placement Readiness & Technical Core',
    sourceType: 'assessment',
    sourceTitle: `Mock Placement Test (${correctCount}/${questions.length})`,
    score: correctCount,
    maxScore: questions.length,
    percentage: accuracy,
    details: `Multi-section exam: OS, DBMS, SQL, Aptitude, Coding. Time: ${Math.round((timeSpentSec || 300) / 60)}m.`,
  });

  return res.json({ score: correctCount, total: questions.length, accuracy, breakdown });
});

// ================= AI RECOMMENDATION & TUTOR ROUTES =================
app.get('/api/ai/recommendations', async (req: Request, res: Response) => {
  const user = getReqUserOrDemo(req);
  const userSkills = db.getUserSkills(user.id);
  const attempts = db.getUserAptitudeAttempts(user.id);
  const submissions = db.getUserCodingSubmissions(user.id);
  const evidence = db.getUserEvidence(user.id);

  const recommendations = await generateSkillGapAndRecommendations(
    user,
    userSkills,
    attempts,
    submissions,
    evidence
  );

  return res.json(recommendations);
});

app.post('/api/ai/tutor', async (req: Request, res: Response) => {
  const { topic, query, mode } = req.body;
  if (!topic || !query) return res.status(400).json({ error: 'Topic and Query required' });

  const answer = await askAiTutor(topic, query, mode || 'socratic');
  return res.json({ answer });
});

app.post('/api/ai/debugger', async (req: Request, res: Response) => {
  const { brokenCode, language, currentAttempt, hintLevel } = req.body;
  const result = await askAiDebugger(brokenCode || '', language || 'javascript', currentAttempt || '', Number(hintLevel) || 1);
  return res.json(result);
});

// ================= VITE DEV MIDDLEWARE / STATIC FILES =================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SkillProof AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
