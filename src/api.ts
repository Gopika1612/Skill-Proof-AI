import {
  User,
  Skill,
  UserSkill,
  SkillEvidence,
  AptitudeTopic,
  AptitudeQuestion,
  AptitudeAttempt,
  AptitudeMistake,
  CodingChallenge,
  CodingSubmission,
  Tutorial,
  Project,
  ProjectSubmission,
  ProjectReadiness,
  CompanyProject,
  RecommendationPayload,
} from './types';

let currentUserId: string = localStorage.getItem('skillproof_userId') || 'usr-student-1';

export function setCurrentUserId(userId: string) {
  currentUserId = userId;
  localStorage.setItem('skillproof_userId', userId);
}

export function getCurrentUserId() {
  return currentUserId;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    'x-user-id': currentUserId,
    ...(options.headers || {}),
  };

  const res = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || `Request failed with status ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Auth
  register: (body: Partial<User>) => request<{ user: User }>('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (email: string, password?: string) => request<{ user: User }>('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  getMe: () => request<{ user: User }>('/api/auth/me'),
  updateProfile: (body: Partial<User>) => request<{ user: User }>('/api/auth/profile', { method: 'PUT', body: JSON.stringify(body) }),

  // Skills
  getAllSkills: () => request<{ skills: Skill[] }>('/api/skills'),
  getUserSkills: () => request<{ userSkills: UserSkill[] }>('/api/skills/user'),
  updateUserSkill: (skillId: string, declaredScore: number) =>
    request<{ userSkill: UserSkill }>('/api/skills/user', {
      method: 'POST',
      body: JSON.stringify({ skillId, declaredScore }),
    }),
  getEvidence: () => request<{ evidence: SkillEvidence[] }>('/api/skills/evidence'),

  // Aptitude
  getAptitudeTopics: () => request<{ topics: AptitudeTopic[] }>('/api/aptitude/topics'),
  getAptitudeQuestions: (params?: { topicId?: string; category?: string; difficulty?: string; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.topicId) query.set('topicId', params.topicId);
    if (params?.category) query.set('category', params.category);
    if (params?.difficulty) query.set('difficulty', params.difficulty);
    if (params?.limit) query.set('limit', String(params.limit));
    return request<{ questions: AptitudeQuestion[] }>(`/api/aptitude/questions?${query.toString()}`);
  },
  getDailyPractice: () => request<{ questions: AptitudeQuestion[]; focusTopics: string[] }>('/api/aptitude/daily-practice'),
  getDailyTest: () => request<{ testTitle: string; durationMinutes: number; questions: AptitudeQuestion[] }>('/api/aptitude/daily-test'),
  getWeeklyTest: () => request<{ testTitle: string; durationMinutes: number; totalQuestions: number; questions: AptitudeQuestion[] }>('/api/aptitude/weekly-test'),
  submitAptitude: (body: {
    type: 'daily_practice' | 'daily_test' | 'weekly_test' | 'mistake_retry' | 'speed_challenge';
    answers: { questionId: string; userAnswer: number; timeSpentSec?: number }[];
    timeSpentSec: number;
  }) => request<{ attempt: AptitudeAttempt }>('/api/aptitude/submit', { method: 'POST', body: JSON.stringify(body) }),
  getAptitudeAttempts: () => request<{ attempts: AptitudeAttempt[] }>('/api/aptitude/attempts'),
  getMistakes: () => request<{ mistakes: AptitudeMistake[] }>('/api/aptitude/mistakes'),
  resolveMistake: (id: string) => request<{ success: boolean }>(`/api/aptitude/mistakes/${id}/resolve`, { method: 'POST' }),

  // Coding
  getCodingChallenges: () => request<{ challenges: CodingChallenge[] }>('/api/coding/challenges'),
  getCodingChallenge: (id: string) => request<{ challenge: CodingChallenge }>(`/api/coding/challenges/${id}`),
  runCode: (body: { challengeId: string; language: string; code: string }) =>
    request<{
      result: {
        status: string;
        passedTests: number;
        totalTests: number;
        score: number;
        executionTimeMs: number;
        output?: string;
        error?: string;
        testDetails: any[];
      };
    }>('/api/coding/run', { method: 'POST', body: JSON.stringify(body) }),
  submitCode: (body: { challengeId: string; language: string; code: string }) =>
    request<{ submission: CodingSubmission; runResult: any }>('/api/coding/submit', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  getCodingSubmissions: () => request<{ submissions: CodingSubmission[] }>('/api/coding/submissions'),

  // Tutorials
  getTutorials: () => request<{ tutorials: Tutorial[] }>('/api/tutorials'),
  completeTutorial: (id: string) => request<{ evidence: SkillEvidence }>(`/api/tutorials/${id}/complete`, { method: 'POST' }),

  // Projects
  getProjects: () => request<{ projects: Project[] }>('/api/projects'),
  submitProject: (body: { projectId: string; repoUrl?: string; liveUrl?: string; notes?: string; completedTaskIds: string[] }) =>
    request<{ submission: ProjectSubmission }>('/api/projects/submit', { method: 'POST', body: JSON.stringify(body) }),
  getProjectSubmissions: () => request<{ submissions: ProjectSubmission[] }>('/api/projects/submissions'),

  // Company
  getCompanyProjects: (orgId?: string) => request<{ projects: CompanyProject[] }>(`/api/company/projects?orgId=${orgId || ''}`),
  getCompanyReadiness: (projectId: string) => request<ProjectReadiness>(`/api/company/readiness/${projectId}`),
  getCompanyEmployees: (orgId?: string) => request<{ employees: User[] }>(`/api/company/employees?orgId=${orgId || ''}`),

  // Placement
  getPlacementQuestions: () => request<{ questions: any[] }>('/api/placement/questions'),
  submitPlacementMock: (body: { answers: { questionId: string; userAnswer: number }[]; timeSpentSec: number }) =>
    request<{ score: number; total: number; accuracy: number; breakdown: Record<string, { total: number; correct: number }> }>('/api/placement/mock-submit', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  // AI recommendations, tutor & debugger
  getAiRecommendations: () => request<RecommendationPayload>('/api/ai/recommendations'),
  askAiTutor: (topic: string, query: string, mode: 'socratic' | 'explain' | 'hint' | 'practice') =>
    request<{ answer: string }>('/api/ai/tutor', {
      method: 'POST',
      body: JSON.stringify({ topic, query, mode }),
    }),
  askAiDebugger: (brokenCode: string, language: string, currentAttempt: string, hintLevel: number) =>
    request<{ hint: string; conceptCheck: string }>('/api/ai/debugger', {
      method: 'POST',
      body: JSON.stringify({ brokenCode, language, currentAttempt, hintLevel }),
    }),
};
