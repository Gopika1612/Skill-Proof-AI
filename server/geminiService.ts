import { GoogleGenAI } from '@google/genai';
import { User, UserSkill, AptitudeAttempt, CodingSubmission, SkillEvidence } from './types.js';

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export async function generateSkillGapAndRecommendations(
  user: User,
  userSkills: UserSkill[],
  aptitudeAttempts: AptitudeAttempt[],
  codingSubmissions: CodingSubmission[],
  evidenceList: SkillEvidence[]
): Promise<{
  summary: string;
  identifiedGaps: string[];
  recommendedActions: {
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    targetDomain: string;
    estimatedMinutes: number;
  }[];
  todayMission: {
    title: string;
    items: {
      type: 'learn' | 'coding' | 'aptitude' | 'mistake_review' | 'project';
      title: string;
      durationMinutes: number;
      actionUrl: string;
    }[];
  };
}> {
  const ai = getAiClient();

  // If no AI key available, perform algorithmic generation
  if (!ai) {
    return generateAlgorithmicRecommendations(user, userSkills, aptitudeAttempts, codingSubmissions);
  }

  try {
    const verifiedSkills = userSkills.filter((s) => s.status === 'verified');
    const weakSkills = userSkills.filter((s) => s.verifiedScore < 60);
    const avgAptitudeAccuracy =
      aptitudeAttempts.length > 0
        ? Math.round(aptitudeAttempts.reduce((acc, a) => acc + a.accuracy, 0) / aptitudeAttempts.length)
        : 0;

    const prompt = `
You are the Chief Skill & Career Strategist at SkillProof AI.
Analyze this real candidate profile and performance data:
Candidate: ${user.name} (${user.role})
Target Role: ${user.targetRole || 'Full Stack & AI Engineer'}
Career Goal: ${user.careerGoal || 'Software Development & Placement'}
Daily Learning Time: ${user.availableLearningTimeMinutes} minutes

Skills:
${userSkills.map((s) => `- ${s.skillName} (${s.category}): Verified ${s.verifiedScore}%, Status: ${s.status}`).join('\n')}

Aptitude Performance:
- Attempts: ${aptitudeAttempts.length}
- Average Accuracy: ${avgAptitudeAccuracy}%
${aptitudeAttempts.slice(0, 3).map((a) => `- Attempt ${a.type}: ${a.accuracy}% accuracy (${a.score}/${a.totalQuestions})`).join('\n')}

Coding Performance:
- Submissions: ${codingSubmissions.length}
- Solved Challenges: ${codingSubmissions.filter((c) => c.status === 'accepted').length}

Skill Evidence Entries: ${evidenceList.length}

Generate a JSON object with:
{
  "summary": "2-3 sentences concise diagnostic appraisal of strengths vs gaps.",
  "identifiedGaps": ["list of 3-4 specific technical or aptitude gaps to close"],
  "recommendedActions": [
    {
      "title": "Action title",
      "description": "Why this specific action matters for target role",
      "priority": "high",
      "targetDomain": "Technical | Aptitude | Coding | Project",
      "estimatedMinutes": 15
    }
  ],
  "todayMission": {
    "title": "Today's Targeted Blueprint",
    "items": [
      {
        "type": "learn",
        "title": "Actionable task name",
        "durationMinutes": 10,
        "actionUrl": "/tutorials"
      }
    ]
  }
}
Note: Total minutes across todayMission items must approximately match ${user.availableLearningTimeMinutes} minutes. Return valid JSON only.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    if (parsed.summary && parsed.todayMission?.items) {
      return parsed;
    }
  } catch (err) {
    console.warn('Gemini recommendation call fallback:', err);
  }

  return generateAlgorithmicRecommendations(user, userSkills, aptitudeAttempts, codingSubmissions);
}

function generateAlgorithmicRecommendations(
  user: User,
  userSkills: UserSkill[],
  aptitudeAttempts: AptitudeAttempt[],
  codingSubmissions: CodingSubmission[]
) {
  const weakSkills = userSkills.filter((s) => s.verifiedScore < 60);
  const targetRole = user.targetRole || 'Full Stack Engineer';
  const timeBudget = user.availableLearningTimeMinutes || 45;

  const gaps: string[] = [];
  if (weakSkills.length > 0) {
    gaps.push(`Low verified mastery in ${weakSkills.slice(0, 2).map((s) => s.skillName).join(' & ')}`);
  } else {
    gaps.push('Need verified practical project evidence to prove core stack');
  }

  if (aptitudeAttempts.length === 0) {
    gaps.push('Aptitude speed and diagnostic baseline not yet established');
  } else {
    const recentAccuracy = aptitudeAttempts[0]?.accuracy || 0;
    if (recentAccuracy < 75) {
      gaps.push(`Aptitude accuracy (${recentAccuracy}%) below 75% placement benchmark`);
    }
  }

  const items = [
    {
      type: 'aptitude' as const,
      title: 'Complete Today’s Aptitude Practice (15 Questions)',
      durationMinutes: Math.min(15, Math.round(timeBudget * 0.35)),
      actionUrl: '/aptitude',
    },
    {
      type: 'coding' as const,
      title: 'Solve Coding Challenge: Two Sum / Arrays O(n)',
      durationMinutes: Math.min(20, Math.round(timeBudget * 0.4)),
      actionUrl: '/coding',
    },
    {
      type: 'learn' as const,
      title: 'Study SQL Joins & Query Plans Lesson',
      durationMinutes: Math.min(15, Math.round(timeBudget * 0.25)),
      actionUrl: '/tutorials',
    },
  ];

  return {
    summary: `Profile targeted for ${targetRole}. You have ${userSkills.length} declared skills and ${codingSubmissions.length} coding attempts. Focus on verifiable evidence through coding labs and daily aptitude consistency.`,
    identifiedGaps: gaps,
    recommendedActions: [
      {
        title: 'Master Time & Work and Efficiency Ratios',
        description: 'Crucial for high-frequency placement rounds at top product and service firms.',
        priority: 'high' as const,
        targetDomain: 'Aptitude',
        estimatedMinutes: 20,
      },
      {
        title: 'Submit Evidence for Two-Pointer Array Algorithms',
        description: 'Verifies DSA proficiency in your SkillProof verification ledger.',
        priority: 'high' as const,
        targetDomain: 'Coding',
        estimatedMinutes: 25,
      },
      {
        title: 'Build and Verify REST Authentication Project',
        description: 'Generates evidence-backed proof of practical backend readiness.',
        priority: 'medium' as const,
        targetDomain: 'Project',
        estimatedMinutes: 30,
      },
    ],
    todayMission: {
      title: `Today’s Focused Mission (${timeBudget} mins)`,
      items,
    },
  };
}

export async function askAiTutor(
  skillOrTopic: string,
  userQuestion: string,
  mode: 'socratic' | 'explain' | 'hint' | 'practice'
): Promise<string> {
  const ai = getAiClient();
  if (!ai) {
    if (mode === 'socratic') {
      return `To help you reason through "${skillOrTopic}": What does your current intuition tell you when you look at the relationship between inputs and time complexity? What invariant is maintained?`;
    }
    return `[Concept Summary for ${skillOrTopic}]: The core insight is separating state invariants from transitions. In ${skillOrTopic}, break down each step systematically: identify initial conditions, check boundary limits, and eliminate redundant calculations using memoization or frequency maps.`;
  }

  const systemInstructions: Record<string, string> = {
    socratic:
      'You are a rigorous Socratic Computer Science & Aptitude mentor at SkillProof AI. Do NOT give direct answers immediately. Guide the student with thoughtful questions, ask them to inspect edge cases, and lead them to discover the principle on their own.',
    explain:
      'You are an expert engineer and tutor. Explain the concept cleanly with clear intuition, a short code or math snippet, and practical industry usage. Keep it concise, high-signal, and actionable.',
    hint:
      'Provide a progressive, non-spoiling hint that unblocks the student without giving away the entire solution.',
    practice:
      'Generate a quick interactive problem check to verify the student’s understanding of the concept, with multiple choice options or a mini code prompt.',
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Topic: ${skillOrTopic}\nStudent Query: "${userQuestion}"`,
      config: {
        systemInstruction: systemInstructions[mode] || systemInstructions.explain,
      },
    });

    return response.text || 'Unable to generate response at this time.';
  } catch (err: any) {
    return `AI Tutor guidance for ${skillOrTopic}: Focus on breaking the problem into sub-problems and testing against base cases. (${err.message || 'Service note'})`;
  }
}

export async function askAiDebugger(
  brokenCode: string,
  language: string,
  currentAttempt: string,
  hintLevel: number
): Promise<{ hint: string; conceptCheck: string }> {
  const ai = getAiClient();
  if (!ai) {
    return {
      hint: `Hint Level ${hintLevel}: Check how boundary bounds or variable increments are handled in the loop condition. Ensure you do not modify the container while iterating over it.`,
      conceptCheck: 'What happens when the input array is empty or has only one element?',
    };
  }

  try {
    const prompt = `
You are the AI Debugger at SkillProof AI.
Language: ${language}
Broken Code:
\`\`\`
${brokenCode}
\`\`\`
User's Attempt / Question: "${currentAttempt}"
Hint Level requested: ${hintLevel} (1 = subtle direction, 2 = pointing out the problematic line, 3 = explaining the exact logical flaw).

Return a JSON object:
{
  "hint": "The guidance for hint level ${hintLevel}",
  "conceptCheck": "A quick question testing if they understand why this bug occurred"
}
`;
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    return JSON.parse(response.text || '{}');
  } catch (err) {
    return {
      hint: `Inspect variable scope and loop exit conditions.`,
      conceptCheck: 'Verify off-by-one errors at the array boundaries.',
    };
  }
}
