import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
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
  CompanyOrg,
  CompanyProject,
  PlacementMockQuestion,
  InterviewMessage,
  DailyMissionItem,
} from './types.js';
import {
  SEED_SKILLS,
  SEED_APTITUDE_TOPICS,
  SEED_APTITUDE_QUESTIONS,
  SEED_CODING_CHALLENGES,
  SEED_TUTORIALS,
  SEED_PROJECTS,
  SEED_COMPANY_ORG,
  SEED_COMPANY_PROJECTS,
  SEED_PLACEMENT_QUESTIONS,
} from './seedData.js';

interface DatabaseSchema {
  users: User[];
  skills: Skill[];
  userSkills: UserSkill[];
  skillEvidence: SkillEvidence[];
  aptitudeTopics: AptitudeTopic[];
  aptitudeQuestions: AptitudeQuestion[];
  aptitudeAttempts: AptitudeAttempt[];
  aptitudeMistakes: AptitudeMistake[];
  codingChallenges: CodingChallenge[];
  codingSubmissions: CodingSubmission[];
  tutorials: Tutorial[];
  projects: Project[];
  projectSubmissions: ProjectSubmission[];
  companyOrgs: CompanyOrg[];
  companyProjects: CompanyProject[];
  placementQuestions: PlacementMockQuestion[];
  interviewSessions: { id: string; userId: string; roleType: string; messages: InterviewMessage[]; score?: number }[];
  dailyMissions: Record<string, DailyMissionItem[]>;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      } catch (err) {
        console.error('Failed to parse database file, re-seeding...', err);
      }
    }

    const seeded = this.createInitialSeed();
    this.saveData(seeded);
    return seeded;
  }

  private saveData(state: DatabaseSchema) {
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf-8');
  }

  public persist() {
    this.saveData(this.data);
  }

  private createInitialSeed(): DatabaseSchema {
    const defaultUsers: User[] = [
      {
        id: 'usr-student-1',
        email: 'alex@skillproof.ai',
        password: 'password123',
        name: 'Alex Morgan',
        role: 'student',
        education: 'B.Tech in Computer Science',
        college: 'Apex Institute of Technology',
        department: 'Computer Science & Engineering',
        branch: 'CSE',
        academicYear: 'Final Year',
        experience: 'Fresher / Placement Aspirant',
        careerGoal: 'Crack Product-Based Software & AI Engineering Roles',
        targetRole: 'Full Stack & AI Engineer',
        placementGoal: 'Tier 1 Tech Company',
        availableLearningTimeMinutes: 45,
        createdAt: new Date().toISOString(),
        onboardingCompleted: true,
        skillLevelConfidence: 'intermediate',
        startingPoint: 'standard',
      },
      {
        id: 'usr-emp-priya',
        email: 'priya@nextgencloud.io',
        password: 'password123',
        name: 'Priya Sharma',
        role: 'employee',
        education: 'B.E. Information Technology',
        branch: 'IT',
        experience: '2 Years Software Engineer',
        careerGoal: 'Transition to AI & Cloud Architecture',
        targetRole: 'Cloud AI Engineer',
        availableLearningTimeMinutes: 30,
        createdAt: new Date().toISOString(),
        companyId: 'org-cloudcorp',
        onboardingCompleted: true,
      },
      {
        id: 'usr-emp-alex',
        email: 'alex.corp@nextgencloud.io',
        password: 'password123',
        name: 'Alex C. Rivera',
        role: 'employee',
        education: 'B.S. Software Engineering',
        experience: '1 Year Backend Developer',
        careerGoal: 'Enterprise Microservices & RAG',
        targetRole: 'Backend AI Engineer',
        availableLearningTimeMinutes: 40,
        createdAt: new Date().toISOString(),
        companyId: 'org-cloudcorp',
        onboardingCompleted: true,
      },
      {
        id: 'usr-admin-1',
        email: 'admin@nextgencloud.io',
        password: 'password123',
        name: 'David Vance (Director of Engineering)',
        role: 'company_admin',
        experience: '10+ Years Engineering Leadership',
        careerGoal: 'Team Upskilling & Project Delivery',
        availableLearningTimeMinutes: 60,
        createdAt: new Date().toISOString(),
        companyId: 'org-cloudcorp',
        onboardingCompleted: true,
      },
    ];

    // Seed realistic starting user skills for Alex (student)
    const initialUserSkills: UserSkill[] = [
      {
        id: 'usk-1',
        userId: 'usr-student-1',
        skillId: 'prog-python',
        skillName: 'Python',
        category: 'Programming',
        declaredScore: 70,
        verifiedScore: 65,
        status: 'assessed',
        level: 'Intermediate',
        lastAssessedAt: new Date().toISOString(),
      },
      {
        id: 'usk-2',
        userId: 'usr-student-1',
        skillId: 'dsa-arrays',
        skillName: 'Arrays & Strings',
        category: 'DSA',
        declaredScore: 75,
        verifiedScore: 60,
        status: 'assessed',
        level: 'Intermediate',
        lastAssessedAt: new Date().toISOString(),
      },
      {
        id: 'usk-3',
        userId: 'usr-student-1',
        skillId: 'db-sql',
        skillName: 'SQL & Relational Databases',
        category: 'Database',
        declaredScore: 60,
        verifiedScore: 45,
        status: 'learning',
        level: 'Beginner',
      },
      {
        id: 'usk-4',
        userId: 'usr-student-1',
        skillId: 'ai-genai-llm',
        skillName: 'GenAI & LLMs',
        category: 'AI',
        declaredScore: 80,
        verifiedScore: 50,
        status: 'learning',
        level: 'Intermediate',
      },
      // Employee Priya (strong frontend/backend, developing cloud)
      {
        id: 'usk-e1',
        userId: 'usr-emp-priya',
        skillId: 'web-react',
        skillName: 'React',
        category: 'Web',
        declaredScore: 85,
        verifiedScore: 82,
        status: 'verified',
        level: 'Advanced',
      },
      {
        id: 'usk-e2',
        userId: 'usr-emp-priya',
        skillId: 'web-node',
        skillName: 'Node.js & Express',
        category: 'Web',
        declaredScore: 80,
        verifiedScore: 78,
        status: 'verified',
        level: 'Advanced',
      },
      {
        id: 'usk-e3',
        userId: 'usr-emp-priya',
        skillId: 'ai-rag',
        skillName: 'RAG & Vector Databases',
        category: 'AI',
        declaredScore: 60,
        verifiedScore: 40,
        status: 'learning',
        level: 'Beginner',
      },
      {
        id: 'usk-e4',
        userId: 'usr-emp-priya',
        skillId: 'cloud-docker',
        skillName: 'Docker & Containers',
        category: 'Cloud',
        declaredScore: 75,
        verifiedScore: 70,
        status: 'verified',
        level: 'Advanced',
      },
      // Employee Alex Rivera (strong backend & RAG, gap in React)
      {
        id: 'usk-e5',
        userId: 'usr-emp-alex',
        skillId: 'web-react',
        skillName: 'React',
        category: 'Web',
        declaredScore: 40,
        verifiedScore: 35,
        status: 'learning',
        level: 'Beginner',
      },
      {
        id: 'usk-e6',
        userId: 'usr-emp-alex',
        skillId: 'web-node',
        skillName: 'Node.js & Express',
        category: 'Web',
        declaredScore: 85,
        verifiedScore: 84,
        status: 'verified',
        level: 'Advanced',
      },
      {
        id: 'usk-e7',
        userId: 'usr-emp-alex',
        skillId: 'ai-rag',
        skillName: 'RAG & Vector Databases',
        category: 'AI',
        declaredScore: 80,
        verifiedScore: 80,
        status: 'verified',
        level: 'Advanced',
      },
      {
        id: 'usk-e8',
        userId: 'usr-emp-alex',
        skillId: 'cloud-docker',
        skillName: 'Docker & Containers',
        category: 'Cloud',
        declaredScore: 50,
        verifiedScore: 45,
        status: 'learning',
        level: 'Beginner',
      },
    ];

    const initialEvidence: SkillEvidence[] = [
      {
        id: 'ev-1',
        userId: 'usr-student-1',
        skillId: 'prog-python',
        skillName: 'Python',
        sourceType: 'coding',
        sourceTitle: 'Valid Palindrome Checker in Python',
        score: 100,
        maxScore: 100,
        percentage: 100,
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        details: 'Passed all 4 test suites with clean O(n) execution time (22ms).',
      },
      {
        id: 'ev-2',
        userId: 'usr-student-1',
        skillId: 'dsa-arrays',
        skillName: 'Arrays & Strings',
        sourceType: 'assessment',
        sourceTitle: 'Array Diagnostic Test',
        score: 6,
        maxScore: 10,
        percentage: 60,
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        details: 'Correctly solved two-pointer scenarios; review prefix sums.',
      },
      {
        id: 'ev-3',
        userId: 'usr-emp-priya',
        skillId: 'web-react',
        skillName: 'React',
        sourceType: 'project',
        sourceTitle: 'Production Component Design System',
        score: 85,
        maxScore: 100,
        percentage: 85,
        timestamp: '2026-02-10T10:00:00Z',
        details: 'Implemented decoupled hooks and responsive layout verified by QA.',
      },
    ];

    return {
      users: defaultUsers,
      skills: SEED_SKILLS,
      userSkills: initialUserSkills,
      skillEvidence: initialEvidence,
      aptitudeTopics: SEED_APTITUDE_TOPICS,
      aptitudeQuestions: SEED_APTITUDE_QUESTIONS,
      aptitudeAttempts: [],
      aptitudeMistakes: [],
      codingChallenges: SEED_CODING_CHALLENGES,
      codingSubmissions: [],
      tutorials: SEED_TUTORIALS,
      projects: SEED_PROJECTS,
      projectSubmissions: [],
      companyOrgs: [SEED_COMPANY_ORG],
      companyProjects: SEED_COMPANY_PROJECTS,
      placementQuestions: SEED_PLACEMENT_QUESTIONS,
      interviewSessions: [],
      dailyMissions: {},
    };
  }

  // --- Auth Methods ---
  public findUserByEmail(email: string): User | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserById(id: string): User | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  public createUser(userData: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      ...userData,
      id: 'usr-' + crypto.randomUUID().slice(0, 8),
      createdAt: new Date().toISOString(),
    };
    this.data.users.push(newUser);

    // Bootstrap user's basic declared skills from SEED_SKILLS
    const defaultSkillIds = ['prog-python', 'prog-js', 'dsa-arrays', 'db-sql'];
    defaultSkillIds.forEach((sid) => {
      const sk = this.data.skills.find((s) => s.id === sid);
      if (sk) {
        this.data.userSkills.push({
          id: 'usk-' + crypto.randomUUID().slice(0, 8),
          userId: newUser.id,
          skillId: sk.id,
          skillName: sk.name,
          category: sk.category,
          declaredScore: 40,
          verifiedScore: 0,
          status: 'learning',
          level: 'Foundation',
        });
      }
    });

    this.persist();
    return newUser;
  }

  public updateUserProfile(id: string, updates: Partial<User>): User | null {
    const idx = this.data.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    this.data.users[idx] = { ...this.data.users[idx], ...updates };
    this.persist();
    return this.data.users[idx];
  }

  // --- Skills & Evidence ---
  public getAllSkills(): Skill[] {
    return this.data.skills;
  }

  public getUserSkills(userId: string): UserSkill[] {
    return this.data.userSkills.filter((s) => s.userId === userId);
  }

  public addOrUpdateUserSkill(
    userId: string,
    skillId: string,
    declaredScore: number
  ): UserSkill {
    let existing = this.data.userSkills.find((s) => s.userId === userId && s.skillId === skillId);
    const skill = this.data.skills.find((s) => s.id === skillId);
    if (!skill) throw new Error('Skill not found in catalog');

    if (existing) {
      existing.declaredScore = declaredScore;
      this.recalculateSkillStatus(existing);
    } else {
      existing = {
        id: 'usk-' + crypto.randomUUID().slice(0, 8),
        userId,
        skillId,
        skillName: skill.name,
        category: skill.category,
        declaredScore,
        verifiedScore: 0,
        status: 'learning',
        level: this.computeLevel(0),
      };
      this.data.userSkills.push(existing);
    }
    this.persist();
    return existing;
  }

  public recordSkillEvidence(evidence: Omit<SkillEvidence, 'id' | 'timestamp'>): SkillEvidence {
    const newEv: SkillEvidence = {
      ...evidence,
      id: 'ev-' + crypto.randomUUID().slice(0, 8),
      timestamp: new Date().toISOString(),
    };
    this.data.skillEvidence.unshift(newEv);

    // Update verified score of matching UserSkill
    let userSkill = this.data.userSkills.find(
      (s) => s.userId === evidence.userId && s.skillId === evidence.skillId
    );
    if (!userSkill) {
      const skill = this.data.skills.find((s) => s.id === evidence.skillId);
      if (skill) {
        userSkill = {
          id: 'usk-' + crypto.randomUUID().slice(0, 8),
          userId: evidence.userId,
          skillId: evidence.skillId,
          skillName: skill.name,
          category: skill.category,
          declaredScore: 50,
          verifiedScore: evidence.percentage,
          status: 'assessed',
          level: this.computeLevel(evidence.percentage),
        };
        this.data.userSkills.push(userSkill);
      }
    } else {
      // Evidence-based aggregate calculation: weighted average of all evidence
      const userEvList = this.data.skillEvidence.filter(
        (e) => e.userId === evidence.userId && e.skillId === evidence.skillId
      );
      const avgPercentage = Math.round(
        userEvList.reduce((acc, curr) => acc + curr.percentage, 0) / userEvList.length
      );
      userSkill.verifiedScore = avgPercentage;
      userSkill.lastAssessedAt = new Date().toISOString();
      this.recalculateSkillStatus(userSkill);
    }

    this.persist();
    return newEv;
  }

  private recalculateSkillStatus(userSkill: UserSkill) {
    userSkill.level = this.computeLevel(userSkill.verifiedScore);
    const evCount = this.data.skillEvidence.filter(
      (e) => e.userId === userSkill.userId && e.skillId === userSkill.skillId
    ).length;

    if (evCount >= 2 && userSkill.verifiedScore >= 70) {
      userSkill.status = 'verified';
    } else if (evCount >= 1 || userSkill.verifiedScore > 0) {
      userSkill.status = 'assessed';
    } else {
      userSkill.status = 'learning';
    }
  }

  public computeLevel(score: number): UserSkill['level'] {
    if (score >= 85) return 'Expert';
    if (score >= 70) return 'Advanced';
    if (score >= 50) return 'Intermediate';
    if (score >= 30) return 'Beginner';
    return 'Foundation';
  }

  public getUserEvidence(userId: string): SkillEvidence[] {
    return this.data.skillEvidence.filter((e) => e.userId === userId);
  }

  // --- Aptitude Methods ---
  public getAptitudeTopics(): AptitudeTopic[] {
    return this.data.aptitudeTopics;
  }

  public getAptitudeQuestions(filter?: {
    topicId?: string;
    category?: string;
    difficulty?: string;
    limit?: number;
  }): AptitudeQuestion[] {
    let list = [...this.data.aptitudeQuestions];
    if (filter?.topicId) list = list.filter((q) => q.topicId === filter.topicId);
    if (filter?.category) list = list.filter((q) => q.category === filter.category);
    if (filter?.difficulty) list = list.filter((q) => q.difficulty === filter.difficulty);
    if (filter?.limit) list = list.slice(0, filter.limit);
    return list;
  }

  public generateDailyPracticeSession(userId: string): {
    questions: AptitudeQuestion[];
    focusTopics: string[];
  } {
    // Check weak topics from previous mistakes or attempts
    const userMistakes = this.data.aptitudeMistakes.filter((m) => m.userId === userId && !m.resolved);
    const weakTopicIds = new Set(userMistakes.map((m) => m.topicId));

    // Dynamic selection: 5 Quantitative, 5 Reasoning, 5 Verbal (or whatever pool is available)
    const quantQuestions = this.data.aptitudeQuestions.filter((q) => q.category === 'Quantitative');
    const logicQuestions = this.data.aptitudeQuestions.filter((q) => q.category === 'Logical Reasoning');
    const verbalQuestions = this.data.aptitudeQuestions.filter((q) => q.category === 'Verbal Ability');

    // Prioritize weak topics
    const sortWithWeakPriority = (arr: AptitudeQuestion[]) =>
      [...arr].sort((a, b) => (weakTopicIds.has(b.topicId) ? 1 : 0) - (weakTopicIds.has(a.topicId) ? 1 : 0));

    const selected = [
      ...sortWithWeakPriority(quantQuestions).slice(0, 5),
      ...sortWithWeakPriority(logicQuestions).slice(0, 5),
      ...sortWithWeakPriority(verbalQuestions).slice(0, 5),
    ];

    const focusTopics = Array.from(new Set(selected.map((q) => q.topicName)));
    return { questions: selected, focusTopics };
  }

  public recordAptitudeAttempt(attempt: Omit<AptitudeAttempt, 'id' | 'completedAt'>): AptitudeAttempt {
    const newAttempt: AptitudeAttempt = {
      ...attempt,
      id: 'apt-att-' + crypto.randomUUID().slice(0, 8),
      completedAt: new Date().toISOString(),
    };
    this.data.aptitudeAttempts.unshift(newAttempt);

    // Record mistakes
    attempt.answers.forEach((ans) => {
      if (!ans.isCorrect) {
        const question = this.data.aptitudeQuestions.find((q) => q.id === ans.questionId);
        if (question) {
          const existingMistake = this.data.aptitudeMistakes.find(
            (m) => m.userId === attempt.userId && m.questionId === question.id
          );
          if (existingMistake) {
            existingMistake.attemptCount += 1;
            existingMistake.userAnswer = ans.userAnswer;
            existingMistake.resolved = false;
            existingMistake.lastAttemptedAt = new Date().toISOString();
          } else {
            this.data.aptitudeMistakes.unshift({
              id: 'mst-' + crypto.randomUUID().slice(0, 8),
              userId: attempt.userId,
              questionId: question.id,
              topicId: question.topicId,
              topicName: question.topicName,
              userAnswer: ans.userAnswer,
              correctAnswer: question.correctAnswer,
              mistakeType: ans.timeSpentSec > question.estimatedTimeSec ? 'time_pressure' : 'concept',
              resolved: false,
              attemptCount: 1,
              lastAttemptedAt: new Date().toISOString(),
            });
          }
        }
      }
    });

    // Also record as a skill evidence entry for Aptitude
    this.recordSkillEvidence({
      userId: attempt.userId,
      skillId: 'dsa-arrays', // General aptitude contributes to analytical baseline
      skillName: 'Quantitative & Analytical Reasoning',
      sourceType: 'aptitude',
      sourceTitle: `${attempt.type.replace('_', ' ').toUpperCase()} (${attempt.score}/${attempt.totalQuestions})`,
      score: attempt.score,
      maxScore: attempt.totalQuestions,
      percentage: attempt.accuracy,
      details: `Completed in ${Math.round(attempt.timeSpentSec / 60)}m. Accuracy: ${attempt.accuracy}%.`,
    });

    this.persist();
    return newAttempt;
  }

  public getUserAptitudeAttempts(userId: string): AptitudeAttempt[] {
    return this.data.aptitudeAttempts.filter((a) => a.userId === userId);
  }

  public getUserMistakes(userId: string): (AptitudeMistake & { question?: AptitudeQuestion })[] {
    return this.data.aptitudeMistakes
      .filter((m) => m.userId === userId)
      .map((m) => ({
        ...m,
        question: this.data.aptitudeQuestions.find((q) => q.id === m.questionId),
      }));
  }

  public resolveMistake(userId: string, mistakeId: string) {
    const mistake = this.data.aptitudeMistakes.find((m) => m.id === mistakeId && m.userId === userId);
    if (mistake) {
      mistake.resolved = true;
      this.persist();
    }
  }

  // --- Coding Challenges ---
  public getCodingChallenges(): CodingChallenge[] {
    return this.data.codingChallenges;
  }

  public getCodingChallengeById(id: string): CodingChallenge | undefined {
    return this.data.codingChallenges.find((c) => c.id === id || c.slug === id);
  }

  public recordCodingSubmission(submission: Omit<CodingSubmission, 'id' | 'submittedAt'>): CodingSubmission {
    const newSub: CodingSubmission = {
      ...submission,
      id: 'sub-' + crypto.randomUUID().slice(0, 8),
      submittedAt: new Date().toISOString(),
    };
    this.data.codingSubmissions.unshift(newSub);

    // If accepted or score > 50, log skill evidence
    const challenge = this.data.codingChallenges.find((c) => c.id === submission.challengeId);
    if (challenge && challenge.relatedSkillIds.length > 0) {
      challenge.relatedSkillIds.forEach((skillId) => {
        const skill = this.data.skills.find((s) => s.id === skillId);
        this.recordSkillEvidence({
          userId: submission.userId,
          skillId,
          skillName: skill ? skill.name : challenge.title,
          sourceType: 'coding',
          sourceTitle: `Solved: ${challenge.title} (${submission.language})`,
          score: submission.passedTests,
          maxScore: submission.totalTests,
          percentage: submission.score,
          details: `Passed ${submission.passedTests}/${submission.totalTests} tests in ${submission.executionTimeMs}ms. Status: ${submission.status}.`,
        });
      });
    }

    this.persist();
    return newSub;
  }

  public getUserCodingSubmissions(userId: string): CodingSubmission[] {
    return this.data.codingSubmissions.filter((s) => s.userId === userId);
  }

  // --- Tutorials & Projects ---
  public getTutorials(): Tutorial[] {
    return this.data.tutorials;
  }

  public getProjects(): Project[] {
    return this.data.projects;
  }

  public submitProject(submission: Omit<ProjectSubmission, 'id' | 'submittedAt'>): ProjectSubmission {
    const newSub: ProjectSubmission = {
      ...submission,
      id: 'prjsub-' + crypto.randomUUID().slice(0, 8),
      submittedAt: new Date().toISOString(),
    };
    this.data.projectSubmissions.unshift(newSub);

    const project = this.data.projects.find((p) => p.id === submission.projectId);
    if (project) {
      project.requiredSkills.forEach((req) => {
        this.recordSkillEvidence({
          userId: submission.userId,
          skillId: req.skillId,
          skillName: req.skillName,
          sourceType: 'project',
          sourceTitle: `Project Proof: ${project.title}`,
          score: submission.completedTaskIds.length,
          maxScore: project.tasks.length,
          percentage: submission.score,
          details: `Tasks completed: ${submission.completedTaskIds.length}/${project.tasks.length}. Notes: ${submission.notes}`,
        });
      });
    }

    this.persist();
    return newSub;
  }

  public getUserProjectSubmissions(userId: string): ProjectSubmission[] {
    return this.data.projectSubmissions.filter((s) => s.userId === userId);
  }

  // --- Company Mode & Project Readiness ---
  public getCompanyOrgs(): CompanyOrg[] {
    return this.data.companyOrgs;
  }

  public getCompanyProjects(orgId: string): CompanyProject[] {
    return this.data.companyProjects.filter((p) => p.orgId === orgId);
  }

  public getCompanyEmployees(orgId: string): User[] {
    return this.data.users.filter((u) => u.companyId === orgId);
  }

  public createCompanyProject(projectData: Omit<CompanyProject, 'id'>): CompanyProject {
    const newProj: CompanyProject = {
      ...projectData,
      id: 'cproj-' + crypto.randomUUID().slice(0, 8),
    };
    this.data.companyProjects.push(newProj);
    this.persist();
    return newProj;
  }

  public computeProjectReadiness(projectId: string): {
    project: CompanyProject;
    overallReadinessPercentage: number;
    skillBreakdown: {
      skillId: string;
      skillName: string;
      targetScore: number;
      averageTeamScore: number;
      status: 'Ready' | 'Developing' | 'Gap';
      evidenceSummary: string;
    }[];
    employeeAssessments: {
      employee: User;
      readinessScore: number;
      gaps: string[];
      trainingAssigned: string[];
    }[];
  } | null {
    const project = this.data.companyProjects.find((p) => p.id === projectId);
    if (!project) return null;

    const assignedEmployees = this.data.users.filter((u) => project.assignedEmployeeIds.includes(u.id));

    const skillBreakdown = project.requiredSkills.map((req) => {
      // Find verified scores of all assigned employees for this skill
      const scores = assignedEmployees.map((emp) => {
        const usk = this.data.userSkills.find((s) => s.userId === emp.id && s.skillId === req.skillId);
        return usk ? usk.verifiedScore : 0;
      });
      const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

      let status: 'Ready' | 'Developing' | 'Gap' = 'Gap';
      if (avg >= req.targetScore) {
        status = 'Ready';
      } else if (avg >= req.targetScore * 0.7) {
        status = 'Developing';
      }

      const verifiedCount = assignedEmployees.filter((emp) => {
        const usk = this.data.userSkills.find((s) => s.userId === emp.id && s.skillId === req.skillId);
        return usk && usk.status === 'verified';
      }).length;

      return {
        skillId: req.skillId,
        skillName: req.skillName,
        targetScore: req.targetScore,
        averageTeamScore: avg,
        status,
        evidenceSummary: `${verifiedCount}/${assignedEmployees.length} employees verified in ledger with target >= ${req.targetScore}%.`,
      };
    });

    const readyCount = skillBreakdown.filter((s) => s.status === 'Ready').length;
    const overallReadiness =
      skillBreakdown.length > 0 ? Math.round((readyCount / skillBreakdown.length) * 100) : 0;

    const employeeAssessments = assignedEmployees.map((emp) => {
      const gaps: string[] = [];
      const trainingAssigned: string[] = [];
      let totalAttained = 0;

      project.requiredSkills.forEach((req) => {
        const usk = this.data.userSkills.find((s) => s.userId === emp.id && s.skillId === req.skillId);
        const score = usk ? usk.verifiedScore : 0;
        totalAttained += Math.min(100, Math.round((score / req.targetScore) * 100));

        if (score < req.targetScore) {
          gaps.push(`${req.skillName} (Score: ${score}% / Target: ${req.targetScore}%)`);
          trainingAssigned.push(`Module: ${req.skillName} Practical Sprint & Lab`);
        }
      });

      const readinessScore =
        project.requiredSkills.length > 0
          ? Math.round(totalAttained / project.requiredSkills.length)
          : 0;

      return {
        employee: emp,
        readinessScore,
        gaps,
        trainingAssigned,
      };
    });

    return {
      project,
      overallReadinessPercentage: overallReadiness,
      skillBreakdown,
      employeeAssessments,
    };
  }

  // --- Placement Hub ---
  public getPlacementQuestions(): PlacementMockQuestion[] {
    return this.data.placementQuestions;
  }
}

export const db = new Database();
