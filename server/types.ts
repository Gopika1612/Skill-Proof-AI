export type Role = 'student' | 'employee' | 'faculty' | 'company_admin' | 'platform_admin';

export type SkillCategory = 
  | 'Programming'
  | 'DSA'
  | 'Software Engineering'
  | 'Web'
  | 'Database'
  | 'Data'
  | 'AI'
  | 'Emerging AI'
  | 'Cloud'
  | 'Cybersecurity';

export type SkillLevelStatus = 'Foundation' | 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export type VerificationStatus = 'learning' | 'assessed' | 'verified';

export interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
  role: Role;
  college?: string;
  department?: string;
  education?: string;
  branch?: string;
  academicYear?: string; // '1st Year' | '2nd Year' | '3rd Year' | '4th Year'
  experience?: string;
  careerGoal?: string;
  targetRole?: string;
  placementGoal?: string;
  availableLearningTimeMinutes: number; // e.g. 30, 45, 60, 90 mins/day
  createdAt: string;
  companyId?: string;
  onboardingCompleted?: boolean;
  skillLevelConfidence?: string;
  selectedSkills?: string[];
  startingPoint?: 'zero' | 'standard';
  catchUpActive?: boolean;
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  description: string;
  prerequisites: string[]; // skill IDs
}

export interface UserSkill {
  id: string;
  userId: string;
  skillId: string;
  skillName: string;
  category: SkillCategory;
  declaredScore: number; // 0-100 self-declared
  verifiedScore: number; // 0-100 evidence-based
  status: VerificationStatus;
  level: SkillLevelStatus;
  lastAssessedAt?: string;
}

export interface SkillEvidence {
  id: string;
  userId: string;
  skillId: string;
  skillName: string;
  sourceType: 'assessment' | 'coding' | 'project' | 'aptitude';
  sourceTitle: string;
  score: number;
  maxScore: number;
  percentage: number;
  timestamp: string;
  details: string;
}

export interface AptitudeTopic {
  id: string;
  category: 'Quantitative' | 'Logical Reasoning' | 'Verbal Ability';
  name: string;
  description: string;
  placementWeight: number; // 1-10
}

export interface AptitudeQuestion {
  id: string;
  topicId: string;
  topicName: string;
  category: 'Quantitative' | 'Logical Reasoning' | 'Verbal Ability';
  subtopic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: string[];
  correctAnswer: number; // index 0-3
  explanation: string;
  estimatedTimeSec: number;
  placementRelevance: string; // e.g., "TCS, Infosys, Amazon, Product companies"
}

export interface AptitudeAttempt {
  id: string;
  userId: string;
  type: 'daily_practice' | 'daily_test' | 'weekly_test' | 'mistake_retry' | 'speed_challenge';
  score: number;
  totalQuestions: number;
  accuracy: number;
  timeSpentSec: number;
  completedAt: string;
  answers: {
    questionId: string;
    userAnswer: number;
    isCorrect: boolean;
    timeSpentSec: number;
  }[];
  topicBreakdown: Record<string, { total: number; correct: number; accuracy: number }>;
}

export interface AptitudeMistake {
  id: string;
  userId: string;
  questionId: string;
  topicId: string;
  topicName: string;
  userAnswer: number;
  correctAnswer: number;
  mistakeType: 'calculation' | 'concept' | 'time_pressure' | 'misinterpretation';
  resolved: boolean;
  attemptCount: number;
  lastAttemptedAt: string;
}

export interface CodingChallenge {
  id: string;
  title: string;
  slug: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  relatedSkillIds: string[];
  description: string;
  starterCode: {
    javascript: string;
    python: string;
    sql?: string;
  };
  solutionStub: {
    javascript: string;
    python: string;
  };
  testCases: {
    input: string;
    expectedOutput: string;
    isHidden?: boolean;
    explanation?: string;
  }[];
  sqlSchema?: string;
}

export interface CodingSubmission {
  id: string;
  userId: string;
  challengeId: string;
  challengeTitle: string;
  language: 'javascript' | 'python' | 'sql';
  code: string;
  status: 'accepted' | 'wrong_answer' | 'runtime_error' | 'time_limit_exceeded';
  passedTests: number;
  totalTests: number;
  score: number; // 0-100
  executionTimeMs: number;
  output?: string;
  error?: string;
  submittedAt: string;
}

export interface Tutorial {
  id: string;
  skillId: string;
  skillName: string;
  title: string;
  youtubeId: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationMinutes: number;
  objectives: string[];
  keyTakeaways: string[];
}

export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  requiredSkill: string;
  completed: boolean;
  evidencePrompt: string;
}

export interface Project {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  domain: string;
  description: string;
  objectives: string[];
  requiredSkills: { skillId: string; skillName: string; minLevel: number }[];
  tasks: ProjectTask[];
}

export interface ProjectSubmission {
  id: string;
  userId: string;
  projectId: string;
  projectTitle: string;
  repoUrl?: string;
  liveUrl?: string;
  notes: string;
  completedTaskIds: string[];
  verified: boolean;
  score: number;
  feedback: string;
  submittedAt: string;
}

export interface CompanyOrg {
  id: string;
  name: string;
  domain: string;
  adminUserId: string;
  createdAt: string;
}

export interface CompanyProject {
  id: string;
  orgId: string;
  title: string;
  description: string;
  targetDeadline: string;
  requiredSkills: {
    skillId: string;
    skillName: string;
    category: SkillCategory;
    targetScore: number;
    weight: number;
  }[];
  assignedEmployeeIds: string[];
}

export interface DailyMissionItem {
  id: string;
  type: 'learn' | 'coding' | 'aptitude' | 'mistake_review' | 'project';
  title: string;
  description: string;
  durationMinutes: number;
  actionUrl: string;
  completed: boolean;
  relatedSkill?: string;
}

export interface PlacementMockQuestion {
  id: string;
  section: 'Aptitude' | 'Technical' | 'Coding' | 'SQL';
  topic: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface InterviewMessage {
  role: 'interviewer' | 'candidate';
  content: string;
  timestamp: string;
  evaluation?: {
    technicalAccuracy: number;
    communication: number;
    problemSolving: number;
    feedback: string;
  };
}
