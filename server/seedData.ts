import { Skill, AptitudeTopic, AptitudeQuestion, CodingChallenge, Tutorial, Project, CompanyOrg, CompanyProject, PlacementMockQuestion } from './types.js';

export const SEED_SKILLS: Skill[] = [
  // Programming
  { id: 'prog-python', name: 'Python', category: 'Programming', description: 'Core Python syntax, data structures, and idiomatic scripting', prerequisites: [] },
  { id: 'prog-js', name: 'JavaScript', category: 'Programming', description: 'Modern ES6+, closures, async/await, and event loop', prerequisites: [] },
  { id: 'prog-ts', name: 'TypeScript', category: 'Programming', description: 'Type annotations, generics, interfaces, and compiler configurations', prerequisites: ['prog-js'] },
  { id: 'prog-java', name: 'Java', category: 'Programming', description: 'Object-oriented programming, JVM, collections, and multi-threading', prerequisites: [] },
  { id: 'prog-cpp', name: 'C++', category: 'Programming', description: 'Memory management, pointers, STL, and modern C++ features', prerequisites: [] },
  { id: 'prog-c', name: 'C', category: 'Programming', description: 'Low-level fundamentals, pointers, memory allocation, and structs', prerequisites: [] },
  { id: 'prog-go', name: 'Go', category: 'Programming', description: 'Goroutines, channels, interfaces, and concurrent systems programming', prerequisites: [] },
  { id: 'prog-rust', name: 'Rust', category: 'Programming', description: 'Ownership, borrowing, lifetimes, and memory-safe systems code', prerequisites: [] },

  // DSA
  { id: 'dsa-arrays', name: 'Arrays & Strings', category: 'DSA', description: 'Two-pointer, sliding window, prefix sums, and array manipulations', prerequisites: [] },
  { id: 'dsa-linkedlist', name: 'Linked Lists', category: 'DSA', description: 'Singly, doubly, cycle detection, and pointer manipulation', prerequisites: [] },
  { id: 'dsa-stacks-queues', name: 'Stacks & Queues', category: 'DSA', description: 'LIFO, FIFO, monotonic stacks, and breadth/depth processing', prerequisites: ['dsa-arrays'] },
  { id: 'dsa-trees', name: 'Trees & BST', category: 'DSA', description: 'Binary trees, traversals, LCA, AVL, and binary search trees', prerequisites: ['dsa-stacks-queues'] },
  { id: 'dsa-graphs', name: 'Graphs', category: 'DSA', description: 'BFS, DFS, Dijkstra, topological sort, and cycle detection', prerequisites: ['dsa-trees'] },
  { id: 'dsa-hashing', name: 'Hashing', category: 'DSA', description: 'Hash maps, collision resolution, frequency tables, and sets', prerequisites: ['dsa-arrays'] },
  { id: 'dsa-recursion', name: 'Recursion & Backtracking', category: 'DSA', description: 'Recursive call stacks, permutations, subsets, and N-Queens', prerequisites: [] },
  { id: 'dsa-dp', name: 'Dynamic Programming', category: 'DSA', description: 'Memoization, tabulation, knapsack, and state transition models', prerequisites: ['dsa-recursion'] },
  { id: 'dsa-sorting-searching', name: 'Sorting & Searching', category: 'DSA', description: 'Binary search, QuickSort, MergeSort, and time complexity bounds', prerequisites: ['dsa-arrays'] },

  // Software Engineering
  { id: 'se-oop', name: 'OOP & Clean Architecture', category: 'Software Engineering', description: 'SOLID principles, design patterns, polymorphism, and encapsulation', prerequisites: [] },
  { id: 'se-git', name: 'Git & GitHub', category: 'Software Engineering', description: 'Branching, rebasing, pull requests, resolving merge conflicts', prerequisites: [] },
  { id: 'se-apis', name: 'APIs & REST Architecture', category: 'Software Engineering', description: 'HTTP verbs, status codes, OpenAPI, JSON payloads, and headers', prerequisites: [] },
  { id: 'se-testing', name: 'Testing & Debugging', category: 'Software Engineering', description: 'Unit testing, TDD, integration tests, mock objects, and profiling', prerequisites: [] },
  { id: 'se-system-design', name: 'System Design', category: 'Software Engineering', description: 'Scalability, load balancing, caching, sharding, and CAP theorem', prerequisites: ['se-apis'] },

  // Web
  { id: 'web-react', name: 'React', category: 'Web', description: 'Components, hooks, state management, and virtual DOM lifecycle', prerequisites: ['prog-js'] },
  { id: 'web-nextjs', name: 'Next.js', category: 'Web', description: 'Server-side rendering, App Router, SSR, and API route generation', prerequisites: ['web-react'] },
  { id: 'web-node', name: 'Node.js & Express', category: 'Web', description: 'Event loop, middleware, REST servers, and backend controllers', prerequisites: ['prog-js'] },
  { id: 'web-fastapi', name: 'FastAPI', category: 'Web', description: 'Async Python backend development, Pydantic validation, and Swagger', prerequisites: ['prog-python'] },

  // Database
  { id: 'db-sql', name: 'SQL & Relational Databases', category: 'Database', description: 'Joins, aggregations, window functions, indexes, and normalization', prerequisites: [] },
  { id: 'db-postgres', name: 'PostgreSQL', category: 'Database', description: 'Advanced JSONB, foreign keys, triggers, and query execution plans', prerequisites: ['db-sql'] },
  { id: 'db-mongodb', name: 'MongoDB', category: 'Database', description: 'Document stores, aggregation pipelines, and indexing schemes', prerequisites: [] },
  { id: 'db-redis', name: 'Redis Caching', category: 'Database', description: 'In-memory key-value, Pub/Sub, TTL, and cache eviction strategies', prerequisites: [] },

  // Data
  { id: 'data-pandas', name: 'Pandas & NumPy', category: 'Data', description: 'DataFrames, vectorization, slicing, grouping, and clean data wrangling', prerequisites: ['prog-python'] },
  { id: 'data-etl', name: 'ETL & Data Engineering', category: 'Data', description: 'Data pipelines, batch processing, data warehousing, and schemas', prerequisites: ['db-sql', 'data-pandas'] },

  // AI & Emerging AI
  { id: 'ai-ml', name: 'Machine Learning Fundamentals', category: 'AI', description: 'Regression, classification, decision trees, feature engineering, and metrics', prerequisites: ['prog-python'] },
  { id: 'ai-genai-llm', name: 'GenAI & LLMs', category: 'AI', description: 'Large Language Models, temperature, tokenization, context windows', prerequisites: ['prog-python'] },
  { id: 'ai-prompt-eng', name: 'Prompt Engineering', category: 'AI', description: 'Few-shot, Chain-of-Thought, structured JSON schemas, and system instructions', prerequisites: [] },
  { id: 'ai-rag', name: 'RAG & Vector Databases', category: 'AI', description: 'Chunking, dense embeddings, cosine similarity, Pinecone/Chroma, hybrid search', prerequisites: ['ai-genai-llm'] },
  { id: 'ai-agents', name: 'AI Agents & Agentic AI', category: 'Emerging AI', description: 'ReAct loops, autonomous task execution, planning, and multi-agent coordination', prerequisites: ['ai-genai-llm'] },
  { id: 'ai-tool-calling', name: 'Tool Calling & MCP', category: 'Emerging AI', description: 'Function calling specifications, Model Context Protocol, and API orchestration', prerequisites: ['ai-genai-llm'] },
  { id: 'ai-eval', name: 'AI Evaluation & Observability', category: 'Emerging AI', description: 'Faithfulness metrics, hallucination detection, prompt tracing, and benchmark evaluation', prerequisites: ['ai-rag'] },

  // Cloud & DevOps
  { id: 'cloud-docker', name: 'Docker & Containers', category: 'Cloud', description: 'Dockerfiles, multi-stage builds, container isolation, and compose files', prerequisites: [] },
  { id: 'cloud-kubernetes', name: 'Kubernetes', category: 'Cloud', description: 'Pods, Deployments, Services, ConfigMaps, and cluster orchestration', prerequisites: ['cloud-docker'] },
  { id: 'cloud-aws', name: 'AWS Cloud Services', category: 'Cloud', description: 'EC2, S3, RDS, Lambda, IAM permissions, and VPC networking', prerequisites: [] },
  { id: 'cloud-cicd', name: 'CI/CD Pipelines', category: 'Cloud', description: 'GitHub Actions, automated testing, continuous delivery, and release gates', prerequisites: ['se-git'] },

  // Cybersecurity
  { id: 'sec-secure-coding', name: 'Secure Coding & OWASP', category: 'Cybersecurity', description: 'SQL injection prevention, XSS mitigation, CSRF tokens, and sanitized inputs', prerequisites: ['se-apis'] },
  { id: 'sec-iam-auth', name: 'IAM & Zero Trust Authentication', category: 'Cybersecurity', description: 'JWT tokens, OAuth 2.0 flows, least-privilege RBAC, and secret management', prerequisites: ['se-apis'] },
];

export const SEED_APTITUDE_TOPICS: AptitudeTopic[] = [
  // Quantitative
  { id: 'quant-percentages', category: 'Quantitative', name: 'Percentages', description: 'Base values, successive changes, fraction equivalents, and real-world calculation shortcuts', placementWeight: 9 },
  { id: 'quant-profit-loss', category: 'Quantitative', name: 'Profit & Loss', description: 'Cost price, selling price, marked price, discount percentage, and false weights', placementWeight: 8 },
  { id: 'quant-time-work', category: 'Quantitative', name: 'Time & Work', description: 'Unitary method, efficiency ratios, alternate day work, and pipe cistern flows', placementWeight: 10 },
  { id: 'quant-time-speed-distance', category: 'Quantitative', name: 'Time, Speed & Distance', description: 'Relative velocity, train crossings, river currents, and average velocity', placementWeight: 9 },
  { id: 'quant-ratio-proportion', category: 'Quantitative', name: 'Ratio & Proportion', description: 'Direct/inverse variation, partnership profit divisions, and mixture replacement formulas', placementWeight: 8 },
  { id: 'quant-probability', category: 'Quantitative', name: 'Probability & Combinatorics', description: 'Permutations, combinations, independent events, dice, coins, and card draws', placementWeight: 7 },
  { id: 'quant-averages-ages', category: 'Quantitative', name: 'Averages & Ages', description: 'Weighted averages, age equation problems, and group replacement shifts', placementWeight: 8 },

  // Logical Reasoning
  { id: 'logic-number-series', category: 'Logical Reasoning', name: 'Number & Letter Series', description: 'Arithmetic, geometric, alternate, double-difference, and alphabet shift sequences', placementWeight: 8 },
  { id: 'logic-blood-relations', category: 'Logical Reasoning', name: 'Blood Relations', description: 'Family trees, coded generational relations, and pointing dialogue puzzles', placementWeight: 9 },
  { id: 'logic-syllogisms', category: 'Logical Reasoning', name: 'Syllogisms & Deductive Logic', description: 'Venn diagrams, Some/All/No logic propositions, and conclusion validity', placementWeight: 9 },
  { id: 'logic-seating-arrangement', category: 'Logical Reasoning', name: 'Seating Arrangements', description: 'Linear row facing north/south, circular facing center/outside, and grid placements', placementWeight: 10 },
  { id: 'logic-coding-decoding', category: 'Logical Reasoning', name: 'Coding-Decoding', description: 'Substitution cipher, letter movement, numerical positional values, and matrix keys', placementWeight: 7 },

  // Verbal Ability
  { id: 'verbal-reading-comp', category: 'Verbal Ability', name: 'Reading Comprehension', description: 'Inference extraction, tone identification, central theme, and critical analysis', placementWeight: 9 },
  { id: 'verbal-error-detection', category: 'Verbal Ability', name: 'Error Detection & Grammar', description: 'Subject-verb agreement, modifier placement, tense consistency, and parallelism', placementWeight: 10 },
  { id: 'verbal-para-jumbles', category: 'Verbal Ability', name: 'Para Jumbles & Sentence Ordering', description: 'Mandatory pair identification, transitional words, and narrative coherence', placementWeight: 8 },
  { id: 'verbal-vocab-synonyms', category: 'Verbal Ability', name: 'Vocabulary & Contextual Usage', description: 'High-frequency GRE/campus synonyms, antonyms, and precise word substitution', placementWeight: 7 },
];

export const SEED_APTITUDE_QUESTIONS: AptitudeQuestion[] = [
  // Quantitative - Time & Work
  {
    id: 'aq-tw-1',
    topicId: 'quant-time-work',
    topicName: 'Time & Work',
    category: 'Quantitative',
    subtopic: 'Efficiency & Combined Work',
    difficulty: 'easy',
    question: 'A can complete a project in 12 days, while B can complete the same project in 24 days. If they work together, in how many days will they finish the project?',
    options: ['6 days', '8 days', '10 days', '16 days'],
    correctAnswer: 1, // 8 days
    explanation: "A's 1-day work = 1/12. B's 1-day work = 1/24. Combined 1-day work = 1/12 + 1/24 = 3/24 = 1/8. Hence, together they take 8 days.",
    estimatedTimeSec: 45,
    placementRelevance: 'TCS, Cognizant, Wipro, Accenture',
  },
  {
    id: 'aq-tw-2',
    topicId: 'quant-time-work',
    topicName: 'Time & Work',
    category: 'Quantitative',
    subtopic: 'Worker Efficiency Ratio',
    difficulty: 'medium',
    question: 'A is twice as efficient as B. If A and B together finish a task in 14 days, in how many days can A alone complete the entire task?',
    options: ['21 days', '28 days', '35 days', '42 days'],
    correctAnswer: 0, // 21 days
    explanation: 'Ratio of efficiencies A : B = 2 : 1. Total units completed per day = 3 units. Total work = 3 * 14 = 42 units. Time taken by A alone = 42 / 2 = 21 days.',
    estimatedTimeSec: 60,
    placementRelevance: 'Amazon, Infosys, Capgemini',
  },
  {
    id: 'aq-tw-3',
    topicId: 'quant-time-work',
    topicName: 'Time & Work',
    category: 'Quantitative',
    subtopic: 'Alternate Days Work',
    difficulty: 'hard',
    question: 'A can do a piece of work in 20 days and B in 30 days. They work on alternate days starting with A. In how many days will the work be completed?',
    options: ['24 days', '25 days', '23.5 days', '26 days'],
    correctAnswer: 0, // 24 days
    explanation: 'Assume Total Work = LCM(20, 30) = 60 units. A makes 3 units/day, B makes 2 units/day. In 2 days (A then B), they complete 3 + 2 = 5 units. To reach 60 units: 60 / 5 = 12 cycles. Total days = 12 * 2 = 24 days.',
    estimatedTimeSec: 75,
    placementRelevance: 'Product Based Companies, Goldman Sachs, Deloitte',
  },

  // Quantitative - Percentages
  {
    id: 'aq-pct-1',
    topicId: 'quant-percentages',
    topicName: 'Percentages',
    category: 'Quantitative',
    subtopic: 'Successive Percentage Change',
    difficulty: 'easy',
    question: 'The price of a software license increased by 20% and then in a promotional sale was decreased by 20%. What is the net percentage change in the price?',
    options: ['0% change', '4% increase', '4% decrease', '2% decrease'],
    correctAnswer: 2, // 4% decrease
    explanation: 'Net change formula: a + b + (ab)/100 = 20 - 20 + (20 * -20)/100 = -400/100 = -4%. Hence, a 4% decrease.',
    estimatedTimeSec: 40,
    placementRelevance: 'TCS, Infosys, IBM',
  },
  {
    id: 'aq-pct-2',
    topicId: 'quant-percentages',
    topicName: 'Percentages',
    category: 'Quantitative',
    subtopic: 'Expenditure & Price Balance',
    difficulty: 'medium',
    question: 'If the price of cloud hosting increases by 25%, by what percentage must a team reduce consumption so their total hosting bill remains unchanged?',
    options: ['20%', '25%', '16.67%', '30%'],
    correctAnswer: 0, // 20%
    explanation: 'Formula for percentage reduction to maintain expenditure = [R / (100 + R)] * 100 = [25 / 125] * 100 = 1/5 * 100 = 20%.',
    estimatedTimeSec: 50,
    placementRelevance: 'Amazon, Microsoft, Tech Mahindra',
  },

  // Quantitative - Time, Speed & Distance
  {
    id: 'aq-tsd-1',
    topicId: 'quant-time-speed-distance',
    topicName: 'Time, Speed & Distance',
    category: 'Quantitative',
    subtopic: 'Train & Platform Crossing',
    difficulty: 'medium',
    question: 'A train 180 meters long moving at 72 km/h crosses a platform in 20 seconds. What is the length of the platform?',
    options: ['200 m', '220 m', '250 m', '180 m'],
    correctAnswer: 1, // 220 m
    explanation: 'Speed = 72 * (5/18) = 20 m/s. Total distance in 20 sec = 20 * 20 = 400 m. Total distance = Train Length + Platform Length. Platform Length = 400 - 180 = 220 m.',
    estimatedTimeSec: 60,
    placementRelevance: 'TCS Digital, Cognizant GenC Next',
  },

  // Quantitative - Profit & Loss
  {
    id: 'aq-pl-1',
    topicId: 'quant-profit-loss',
    topicName: 'Profit & Loss',
    category: 'Quantitative',
    subtopic: 'Discounts & Marked Price',
    difficulty: 'medium',
    question: 'A merchant marks his goods 40% above the cost price and allows a discount of 15% on the marked price. What is his actual profit percentage?',
    options: ['19%', '25%', '22%', '17.5%'],
    correctAnswer: 0, // 19%
    explanation: 'Let CP = 100. MP = 140. Discount = 15% of 140 = 21. SP = 140 - 21 = 119. Profit% = (119 - 100)% = 19%.',
    estimatedTimeSec: 50,
    placementRelevance: 'Accenture, Wipro',
  },

  // Logical Reasoning - Blood Relations
  {
    id: 'aq-br-1',
    topicId: 'logic-blood-relations',
    topicName: 'Blood Relations',
    category: 'Logical Reasoning',
    subtopic: 'Pointing to a Photograph',
    difficulty: 'medium',
    question: 'Pointing to a gentleman, Priya said, "His only brother is the father of my daughter\'s father." How is the gentleman related to Priya?',
    options: ['Father', 'Uncle / Father-in-law\'s brother', 'Brother-in-law', 'Grandfather'],
    correctAnswer: 1,
    explanation: 'Priya\'s daughter\'s father is Priya\'s husband. Father of Priya\'s husband is Priya\'s father-in-law. The gentleman is the brother of Priya\'s father-in-law (paternal uncle-in-law).',
    estimatedTimeSec: 60,
    placementRelevance: 'TCS, Infosys, Capgemini',
  },

  // Logical Reasoning - Syllogisms
  {
    id: 'aq-syl-1',
    topicId: 'logic-syllogisms',
    topicName: 'Syllogisms & Deductive Logic',
    category: 'Logical Reasoning',
    subtopic: 'Two Proposition Deduction',
    difficulty: 'medium',
    question: 'Statements:\n1. All algorithms are programs.\n2. Some programs are scalable.\n\nConclusions:\nI. Some algorithms are scalable.\nII. Some programs are algorithms.',
    options: ['Only conclusion I follows', 'Only conclusion II follows', 'Both I and II follow', 'Neither I nor II follows'],
    correctAnswer: 1, // Only II follows
    explanation: 'From "All algorithms are programs", it immediately converts to "Some programs are algorithms" (valid). However, the scalable programs might not intersect with algorithms, so Conclusion I is not definitely true. Hence, only II follows.',
    estimatedTimeSec: 45,
    placementRelevance: 'Amazon, Infosys, Tech Mahindra',
  },

  // Logical Reasoning - Number Series
  {
    id: 'aq-ns-1',
    topicId: 'logic-number-series',
    topicName: 'Number & Letter Series',
    category: 'Logical Reasoning',
    subtopic: 'Differences of Differences',
    difficulty: 'easy',
    question: 'Find the next term in the series: 3, 7, 15, 31, 63, ?',
    options: ['125', '127', '129', '131'],
    correctAnswer: 1, // 127
    explanation: 'Pattern: (x * 2) + 1. 3*2+1=7; 7*2+1=15; 15*2+1=31; 31*2+1=63; 63*2+1=127.',
    estimatedTimeSec: 30,
    placementRelevance: 'Wipro, TCS Ninja',
  },

  // Verbal Ability - Error Detection
  {
    id: 'aq-err-1',
    topicId: 'verbal-error-detection',
    topicName: 'Error Detection & Grammar',
    category: 'Verbal Ability',
    subtopic: 'Subject-Verb Agreement',
    difficulty: 'easy',
    question: 'Identify the segment with the grammatical error:\n"Neither the database architect (A) / nor the software developers (B) / was aware of the security breach (C) / during yesterday\'s deployment (D)."',
    options: ['Segment A', 'Segment B', 'Segment C ("was aware")', 'Segment D'],
    correctAnswer: 2, // Segment C
    explanation: 'When subjects are joined by "neither... nor", the verb agrees with the closer subject ("software developers" - plural). Therefore, it must be "were aware", not "was aware".',
    estimatedTimeSec: 35,
    placementRelevance: 'Amazon, TCS, Infosys, Cognizant',
  },

  // Verbal Ability - Para Jumbles
  {
    id: 'aq-pj-1',
    topicId: 'verbal-para-jumbles',
    topicName: 'Para Jumbles & Sentence Ordering',
    category: 'Verbal Ability',
    subtopic: 'Coherent Sequencing',
    difficulty: 'medium',
    question: 'Rearrange sentences (P, Q, R, S) into a meaningful paragraph:\nP: This rapid feedback loop dramatically reduces production bugs.\nQ: Continuous integration automates merging code commits from multiple contributors.\nR: Once merged, automated test suites immediately run to validate code changes.\nS: As a result, software teams can ship reliable features with high velocity.',
    options: ['Q - R - P - S', 'P - Q - R - S', 'Q - P - R - S', 'R - Q - S - P'],
    correctAnswer: 0, // Q - R - P - S
    explanation: 'Q introduces the concept (CI merging). R describes the immediate next step (running automated tests). P explains the benefit of that step (rapid feedback). S concludes with the overarching impact (shipping velocity).',
    estimatedTimeSec: 50,
    placementRelevance: 'Product Companies, Deloitte, Accenture',
  },

  // TCS NQT - Clocks & Angles
  {
    id: 'aq-tcs-clocks',
    topicId: 'quant-time-speed-distance',
    topicName: 'Time, Speed & Distance',
    category: 'Quantitative',
    subtopic: 'Clocks & Angles',
    difficulty: 'medium',
    question: 'What is the angle between the minute hand and the hour hand of a standard clock at 3:40?',
    options: ['120°', '130°', '140°', '125°'],
    correctAnswer: 1, // 130°
    explanation: 'Formula for angle between hands: |30H - (11/2)M| = |30(3) - 5.5(40)| = |90 - 220| = 130°.',
    estimatedTimeSec: 45,
    placementRelevance: 'TCS NQT, Wipro Elite, Cognizant GenC',
  },

  // Infosys InfyTQ - Probability
  {
    id: 'aq-infy-prob',
    topicId: 'quant-probability',
    topicName: 'Probability & Combinatorics',
    category: 'Quantitative',
    subtopic: 'Simultaneous Events',
    difficulty: 'medium',
    question: 'Two fair standard dice are thrown simultaneously. What is the probability of getting a sum greater than or equal to 10?',
    options: ['1/6', '1/9', '5/36', '1/4'],
    correctAnswer: 0, // 1/6
    explanation: 'Total sample space = 6 * 6 = 36. Favorable outcomes with sum >= 10: (4,6), (5,5), (5,6), (6,4), (6,5), (6,6) = 6 pairs. Probability = 6/36 = 1/6.',
    estimatedTimeSec: 50,
    placementRelevance: 'Infosys InfyTQ, Amazon, Accenture',
  },

  // Amazon SDE - Boats & Streams
  {
    id: 'aq-amz-boats',
    topicId: 'quant-time-speed-distance',
    topicName: 'Time, Speed & Distance',
    category: 'Quantitative',
    subtopic: 'Boats & Streams',
    difficulty: 'hard',
    question: 'A boat travels 24 km downstream in 2 hours and takes 4 hours to return the same distance upstream. What is the speed of the boat in still water?',
    options: ['8 km/h', '9 km/h', '10 km/h', '6 km/h'],
    correctAnswer: 1, // 9 km/h
    explanation: 'Downstream velocity (D) = 24/2 = 12 km/h. Upstream velocity (U) = 24/4 = 6 km/h. Boat speed in still water = (D + U)/2 = (12 + 6)/2 = 9 km/h.',
    estimatedTimeSec: 60,
    placementRelevance: 'Amazon SDE, Goldman Sachs, TCS Digital',
  },

  // TCS NQT - Coded Direction Sense
  {
    id: 'aq-tcs-dir',
    topicId: 'logic-coding-decoding',
    topicName: 'Coding-Decoding',
    category: 'Logical Reasoning',
    subtopic: 'Direction & Displacement Sense',
    difficulty: 'medium',
    question: 'Rohan walks 15 meters North, turns right and walks 20 meters, then turns right again and walks 15 meters. Finally, he turns left and walks 10 meters. How far and in which direction is he now from his starting point?',
    options: ['30 meters East', '25 meters North-East', '30 meters West', '20 meters East'],
    correctAnswer: 0, // 30 meters East
    explanation: 'Vertical displacement = 15m North - 15m South = 0. Horizontal displacement = 20m East + 10m East = 30m East.',
    estimatedTimeSec: 45,
    placementRelevance: 'TCS NQT, Cognizant GenC, Capgemini',
  },

  // Accenture / Cognizant - Circular Seating Arrangement
  {
    id: 'aq-acc-seat',
    topicId: 'logic-seating-arrangement',
    topicName: 'Seating Arrangements',
    category: 'Logical Reasoning',
    subtopic: 'Circular Facing Center',
    difficulty: 'hard',
    question: 'Six developers (A, B, C, D, E, F) sit in a circle facing the center. A is second to the left of C. B sits adjacent to neither A nor C. D is immediate right of A. Who sits directly opposite to A?',
    options: ['E', 'B', 'F', 'C'],
    correctAnswer: 1, // B
    explanation: 'Fixing C at pos 1: A is 2nd left -> pos 5. D is immediate right of A -> pos 4. Since B cannot sit at pos 4, 6 (adjacent to A) or pos 2, 6 (adjacent to C), B must sit at pos 2, which is directly opposite pos 5 (A). Hence B is opposite A.',
    estimatedTimeSec: 75,
    placementRelevance: 'Accenture, Infosys, Tech Mahindra',
  },

  // Infosys - Alphanumeric Series
  {
    id: 'aq-infy-series',
    topicId: 'logic-number-series',
    topicName: 'Number & Letter Series',
    category: 'Logical Reasoning',
    subtopic: 'Alphanumeric Progression',
    difficulty: 'easy',
    question: 'Find the missing term in the sequence: B2D, E4H, H8L, K16P, ?',
    options: ['N32T', 'M32S', 'N24T', 'O32U'],
    correctAnswer: 0, // N32T
    explanation: 'First letter advances by +3 (B->E->H->K->N). Middle number doubles (*2 -> 2, 4, 8, 16, 32). Last letter advances by +4 (D->H->L->P->T). Missing term = N32T.',
    estimatedTimeSec: 35,
    placementRelevance: 'Infosys, Wipro, TCS Ninja',
  },
];

export const SEED_CODING_CHALLENGES: CodingChallenge[] = [
  {
    id: 'code-two-sum',
    title: 'Two Sum Optimal Finder',
    slug: 'two-sum-optimal',
    difficulty: 'easy',
    category: 'Arrays & Hashing',
    relatedSkillIds: ['dsa-arrays', 'dsa-hashing'],
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target` in O(n) time.\nReturn the indices in sorted order `[i, j]` where `i < j`.',
    starterCode: {
      javascript: `function twoSum(nums, target) {
  // Your O(n) solution using a Map or Object
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      python: `def two_sum(nums, target):
    # Your O(n) solution using a dictionary
    num_map = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] = i
    return []`,
    },
    solutionStub: {
      javascript: `twoSum([2, 7, 11, 15], 9)`,
      python: `two_sum([2, 7, 11, 15], 9)`,
    },
    testCases: [
      { input: '[2, 7, 11, 15], 9', expectedOutput: '[0, 1]' },
      { input: '[3, 2, 4], 6', expectedOutput: '[1, 2]' },
      { input: '[3, 3], 6', expectedOutput: '[0, 1]' },
      { input: '[1, 5, 8, 14, 19], 20', expectedOutput: '[0, 4]', isHidden: true },
    ],
  },
  {
    id: 'code-valid-palindrome',
    title: 'Valid Palindrome Checker',
    slug: 'valid-palindrome-checker',
    difficulty: 'easy',
    category: 'Strings & Two-Pointer',
    relatedSkillIds: ['dsa-arrays'],
    description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase and removing all non-alphanumeric characters, it reads the same forward and backward. Write a function returning `true` or `false`.',
    starterCode: {
      javascript: `function isPalindrome(s) {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0, right = clean.length - 1;
  while (left < right) {
    if (clean[left] !== clean[right]) return false;
    left++;
    right--;
  }
  return true;
}`,
      python: `def is_palindrome(s):
    clean = [c.lower() for c in s if c.isalnum()]
    return clean == clean[::-1]`,
    },
    solutionStub: {
      javascript: `isPalindrome("A man, a plan, a canal: Panama")`,
      python: `is_palindrome("A man, a plan, a canal: Panama")`,
    },
    testCases: [
      { input: '"A man, a plan, a canal: Panama"', expectedOutput: 'true' },
      { input: '"race a car"', expectedOutput: 'false' },
      { input: '" "', expectedOutput: 'true' },
      { input: '"0P"', expectedOutput: 'false', isHidden: true },
    ],
  },
  {
    id: 'code-reverse-linked-list',
    title: 'Reverse Linked List Values',
    slug: 'reverse-linked-list',
    difficulty: 'medium',
    category: 'Linked Lists',
    relatedSkillIds: ['dsa-linkedlist'],
    description: 'Given an array representation of a linked list, return the array representing the reversed linked list in O(n) time and O(1) auxiliary pointer operations.',
    starterCode: {
      javascript: `function reverseList(arr) {
  // Reversal logic
  return arr.slice().reverse();
}`,
      python: `def reverse_list(arr):
    return list(reversed(arr))`,
    },
    solutionStub: {
      javascript: `reverseList([1, 2, 3, 4, 5])`,
      python: `reverse_list([1, 2, 3, 4, 5])`,
    },
    testCases: [
      { input: '[1, 2, 3, 4, 5]', expectedOutput: '[5, 4, 3, 2, 1]' },
      { input: '[1, 2]', expectedOutput: '[2, 1]' },
      { input: '[]', expectedOutput: '[]' },
      { input: '[42]', expectedOutput: '[42]', isHidden: true },
    ],
  },
  {
    id: 'code-sql-top-performers',
    title: 'SQL: Highest Department Earners',
    slug: 'sql-highest-earners',
    difficulty: 'medium',
    category: 'SQL & Database',
    relatedSkillIds: ['db-sql', 'db-postgres'],
    description: 'Write an SQL query to retrieve employee names and salaries whose salary is greater than or equal to $80,000, ordered by salary descending.',
    sqlSchema: `
CREATE TABLE employees (id INT, name TEXT, department TEXT, salary INT);
INSERT INTO employees VALUES (1, 'Alice', 'Engineering', 95000);
INSERT INTO employees VALUES (2, 'Bob', 'Design', 72000);
INSERT INTO employees VALUES (3, 'Charlie', 'Engineering', 88000);
INSERT INTO employees VALUES (4, 'Diana', 'Marketing', 65000);
INSERT INTO employees VALUES (5, 'Evan', 'Engineering', 105000);
`,
    starterCode: {
      javascript: ``,
      python: ``,
      sql: `SELECT name, salary FROM employees WHERE salary >= 80000 ORDER BY salary DESC;`,
    },
    solutionStub: {
      javascript: ``,
      python: ``,
    },
    testCases: [
      {
        input: 'DEFAULT_DB',
        expectedOutput: `[{"name":"Evan","salary":105000},{"name":"Alice","salary":95000},{"name":"Charlie","salary":88000}]`,
      },
    ],
  },
  {
    id: 'code-max-subarray',
    title: 'Maximum Subarray (Kadane’s Algorithm)',
    slug: 'max-subarray-kadane',
    difficulty: 'medium',
    category: 'Dynamic Programming & Arrays',
    relatedSkillIds: ['dsa-dp', 'dsa-arrays'],
    description: 'Given an integer array `nums`, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum in O(n) time and O(1) space.\nPattern: Kadane’s Algorithm (Amazon, Google, Microsoft, TCS Digital).',
    starterCode: {
      javascript: `function maxSubArray(nums) {
  let currentSum = nums[0];
  let maxSum = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  return maxSum;
}`,
      python: `def max_sub_array(nums):
    current_sum = max_sum = nums[0]
    for num in nums[1:]:
        current_sum = max(num, current_sum + num)
        max_sum = max(max_sum, current_sum)
    return max_sum`,
    },
    solutionStub: {
      javascript: `maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])`,
      python: `max_sub_array([-2, 1, -3, 4, -1, 2, 1, -5, 4])`,
    },
    testCases: [
      { input: '[-2, 1, -3, 4, -1, 2, 1, -5, 4]', expectedOutput: '6' },
      { input: '[1]', expectedOutput: '1' },
      { input: '[5, 4, -1, 7, 8]', expectedOutput: '23' },
      { input: '[-1, -2, -3]', expectedOutput: '-1', isHidden: true },
    ],
  },
  {
    id: 'code-valid-parentheses',
    title: 'Valid Parentheses & Bracket Matching',
    slug: 'valid-parentheses-stack',
    difficulty: 'easy',
    category: 'Stacks & String Parsing',
    relatedSkillIds: ['dsa-stacks-queues', 'dsa-arrays'],
    description: 'Given a string `s` containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.\nAn input string is valid if brackets close in the correct order.\nPattern: Monotonic Stack (Google, Adobe, Bloomberg, TCS Ninja).',
    starterCode: {
      javascript: `function isValid(s) {
  const stack = [];
  const pairs = { ')': '(', '}': '{', ']': '[' };
  for (const char of s) {
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else if (stack.pop() !== pairs[char]) {
      return false;
    }
  }
  return stack.length === 0;
}`,
      python: `def is_valid(s):
    stack = []
    pairs = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in '({[':
            stack.append(char)
        elif not stack or stack.pop() != pairs.get(char):
            return False
    return len(stack) == 0`,
    },
    solutionStub: {
      javascript: `isValid("()[]{}")`,
      python: `is_valid("()[]{}")`,
    },
    testCases: [
      { input: '"()"', expectedOutput: 'true' },
      { input: '"()[]{}"', expectedOutput: 'true' },
      { input: '"(]"', expectedOutput: 'false' },
      { input: '"([)]"', expectedOutput: 'false' },
      { input: '"{[]}"', expectedOutput: 'true', isHidden: true },
    ],
  },
  {
    id: 'code-merge-intervals',
    title: 'Merge Overlapping Intervals',
    slug: 'merge-intervals-greedy',
    difficulty: 'medium',
    category: 'Interval Scheduling & Sorting',
    relatedSkillIds: ['dsa-sorting-searching', 'dsa-arrays'],
    description: 'Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals and return an array of non-overlapping intervals.\nPattern: Interval Sorting & Greedy Merging (Google, Microsoft, Meta, Uber).',
    starterCode: {
      javascript: `function merge(intervals) {
  if (!intervals.length) return [];
  intervals.sort((a, b) => a[0] - b[0]);
  const result = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const last = result[result.length - 1];
    if (intervals[i][0] <= last[1]) {
      last[1] = Math.max(last[1], intervals[i][1]);
    } else {
      result.push(intervals[i]);
    }
  }
  return result;
}`,
      python: `def merge_intervals(intervals):
    if not intervals:
        return []
    intervals.sort(key=lambda x: x[0])
    result = [intervals[0]]
    for current in intervals[1:]:
        last = result[-1]
        if current[0] <= last[1]:
            last[1] = max(last[1], current[1])
        else:
            result.append(current)
    return result`,
    },
    solutionStub: {
      javascript: `merge([[1, 3], [2, 6], [8, 10], [15, 18]])`,
      python: `merge_intervals([[1, 3], [2, 6], [8, 10], [15, 18]])`,
    },
    testCases: [
      { input: '[[1, 3], [2, 6], [8, 10], [15, 18]]', expectedOutput: '[[1, 6], [8, 10], [15, 18]]' },
      { input: '[[1, 4], [4, 5]]', expectedOutput: '[[1, 5]]' },
      { input: '[[1, 4], [2, 3]]', expectedOutput: '[[1, 4]]', isHidden: true },
    ],
  },
  {
    id: 'code-binary-search-range',
    title: 'Search Range in Sorted Array',
    slug: 'binary-search-range',
    difficulty: 'medium',
    category: 'Binary Search',
    relatedSkillIds: ['dsa-sorting-searching'],
    description: 'Given an array of integers `nums` sorted in non-decreasing order, find the starting and ending position of a given `target` value in O(log n) runtime. If target is not found, return [-1, -1].\nPattern: Modified Binary Search (Amazon, Meta, TCS Digital).',
    starterCode: {
      javascript: `function searchRange(nums, target) {
  const findBound = (isFirst) => {
    let left = 0, right = nums.length - 1, ans = -1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (nums[mid] === target) {
        ans = mid;
        if (isFirst) right = mid - 1;
        else left = mid + 1;
      } else if (nums[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    return ans;
  };
  return [findBound(true), findBound(false)];
}`,
      python: `def search_range(nums, target):
    def find_bound(is_first):
        left, right, ans = 0, len(nums) - 1, -1
        while left <= right:
            mid = (left + right) // 2
            if nums[mid] == target:
                ans = mid
                if is_first:
                    right = mid - 1
                else:
                    left = mid + 1
            elif nums[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        return ans
    return [find_bound(True), find_bound(False)]`,
    },
    solutionStub: {
      javascript: `searchRange([5, 7, 7, 8, 8, 10], 8)`,
      python: `search_range([5, 7, 7, 8, 8, 10], 8)`,
    },
    testCases: [
      { input: '[5, 7, 7, 8, 8, 10], 8', expectedOutput: '[3, 4]' },
      { input: '[5, 7, 7, 8, 8, 10], 6', expectedOutput: '[-1, -1]' },
      { input: '[], 0', expectedOutput: '[-1, -1]' },
      { input: '[1], 1', expectedOutput: '[0, 0]', isHidden: true },
    ],
  },
  {
    id: 'code-sql-second-highest',
    title: 'SQL: Second Highest Salary',
    slug: 'sql-second-highest-salary',
    difficulty: 'medium',
    category: 'SQL & Database',
    relatedSkillIds: ['db-sql', 'db-postgres'],
    description: 'Write an SQL query to report the second highest salary from the Employee table. If there is no second highest salary, return null.\nPattern: Subquery / Window Function (Amazon, Uber, Oracle, Cognizant).',
    sqlSchema: `
CREATE TABLE employees (id INT, salary INT);
INSERT INTO employees VALUES (1, 100);
INSERT INTO employees VALUES (2, 200);
INSERT INTO employees VALUES (3, 300);
`,
    starterCode: {
      javascript: ``,
      python: ``,
      sql: `SELECT MAX(salary) AS second_highest FROM employees WHERE salary < (SELECT MAX(salary) FROM employees);`,
    },
    solutionStub: {
      javascript: ``,
      python: ``,
    },
    testCases: [
      {
        input: 'DEFAULT_DB',
        expectedOutput: `[{"second_highest":200}]`,
      },
    ],
  },
];

export const SEED_TUTORIALS: Tutorial[] = [
  {
    id: 'tut-python-core',
    skillId: 'prog-python',
    skillName: 'Python',
    title: 'Python Complete Mastery Course for Developers',
    youtubeId: '_uQrJ0TkZlc', // Programming with Mosh Python tutorial
    difficulty: 'Beginner',
    durationMinutes: 45,
    objectives: [
      'Master fundamental data types: lists, tuples, dictionaries, and sets',
      'Understand list comprehensions and generator functions',
      'Implement clean error handling with try/except/finally blocks',
      'Write modular code with packages and modules',
    ],
    keyTakeaways: [
      'Dictionary lookups provide average O(1) complexity',
      'List comprehensions are faster and more readable than standard append loops',
    ],
  },
  {
    id: 'tut-sql-joins',
    skillId: 'db-sql',
    skillName: 'SQL & Relational Databases',
    title: 'SQL Joins, Aggregations, and Subqueries in Depth',
    youtubeId: 'HXV3zeRRBAc', // freeCodeCamp SQL tutorial
    difficulty: 'Intermediate',
    durationMinutes: 35,
    objectives: [
      'Contrast INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN',
      'Compute aggregate analytics with GROUP BY and HAVING filters',
      'Implement correlated subqueries and CTEs (Common Table Expressions)',
      'Inspect indexing strategies for query performance',
    ],
    keyTakeaways: [
      'WHERE filters before aggregation; HAVING filters post-grouping metrics',
      'B-Tree indexes speed up lookups but carry maintenance cost on INSERTs',
    ],
  },
  {
    id: 'tut-rag-agents',
    skillId: 'ai-rag',
    skillName: 'RAG & Vector Databases',
    title: 'Building Production Retrieval Augmented Generation (RAG)',
    youtubeId: 'tcqEjkOfcO4', // LangChain / RAG tutorial
    difficulty: 'Advanced',
    durationMinutes: 40,
    objectives: [
      'Structure chunking strategies (fixed size vs semantic sentence boundaries)',
      'Generate embeddings and store vectors in vector databases',
      'Perform top-k similarity search with metadata filtering',
      'Evaluate generation with context precision and hallucination prevention',
    ],
    keyTakeaways: [
      'Chunk overlap is critical to avoid truncating semantic thoughts between chunks',
      'Hybrid search (dense vector + BM25 keyword) beats vector-only in edge cases',
    ],
  },
  {
    id: 'tut-react-architecture',
    skillId: 'web-react',
    skillName: 'React',
    title: 'Modern React 19 State Management & Hook Best Practices',
    youtubeId: 'bMknfKXIFA8', // React tutorial
    difficulty: 'Intermediate',
    durationMinutes: 30,
    objectives: [
      'Proper usage of useEffect, useMemo, and useCallback hooks',
      'Component separation of concerns and custom hooks',
      'Predictable client state with reducers and contexts',
    ],
    keyTakeaways: [
      'Never mutate state directly; always create fresh immutable objects',
      'Extract data fetching logic into dedicated custom hooks for testability',
    ],
  },
];

export const SEED_PROJECTS: Project[] = [
  {
    id: 'proj-expense-tracker',
    title: 'Personal Finance & Budget Tracker',
    difficulty: 'Beginner',
    domain: 'Full-Stack Application',
    description: 'Build a full-featured budget tracker with expense categorization, monthly expenditure summaries, and persistent data storage.',
    objectives: [
      'Design relational or document schemas for transactions and categories',
      'Implement CRUD API endpoints with data validation',
      'Render responsive charts showcasing spending distributions',
    ],
    requiredSkills: [
      { skillId: 'prog-js', skillName: 'JavaScript', minLevel: 40 },
      { skillId: 'db-sql', skillName: 'SQL & Relational Databases', minLevel: 35 },
      { skillId: 'se-apis', skillName: 'APIs & REST Architecture', minLevel: 40 },
    ],
    tasks: [
      { id: 'pet-1', title: 'Data Model & Schemas', description: 'Create tables for categories (id, name, budget) and expenses (id, categoryId, amount, date, description).', requiredSkill: 'db-sql', completed: false, evidencePrompt: 'Provide the SQL schema or ORM models.' },
      { id: 'pet-2', title: 'REST Endpoints', description: 'Build POST /expenses, GET /expenses?month=10, and DELETE /expenses/:id with input validation.', requiredSkill: 'se-apis', completed: false, evidencePrompt: 'Submit your endpoint routes and controller code.' },
      { id: 'pet-3', title: 'Summary Calculation Engine', description: 'Compute monthly total, category breakdown percentage, and budget threshold alerts.', requiredSkill: 'prog-js', completed: false, evidencePrompt: 'Share calculation functions and test output.' },
    ],
  },
  {
    id: 'proj-secure-auth-api',
    title: 'Enterprise RBAC Authentication & API Gateway',
    difficulty: 'Intermediate',
    domain: 'Backend & Cybersecurity',
    description: 'Develop a hardened authentication service supporting JWT tokens, refresh token rotation, password hashing with bcrypt, and role-based access control.',
    objectives: [
      'Implement secure user registration with salted hashing',
      'Generate short-lived access tokens and stored refresh tokens',
      'Implement middleware verifying user roles and permission policies',
    ],
    requiredSkills: [
      { skillId: 'sec-iam-auth', skillName: 'IAM & Zero Trust Authentication', minLevel: 55 },
      { skillId: 'sec-secure-coding', skillName: 'Secure Coding & OWASP', minLevel: 50 },
      { skillId: 'web-node', skillName: 'Node.js & Express', minLevel: 50 },
    ],
    tasks: [
      { id: 'sa-1', title: 'Salted Password Hashing', description: 'Implement registration with input sanitation and password hashing.', requiredSkill: 'sec-secure-coding', completed: false, evidencePrompt: 'Share hashing implementation and OWASP checks.' },
      { id: 'sa-2', title: 'JWT Sign & Refresh Rotation', description: 'Build /login returning access_token (15m) and refresh_token (7d) stored securely.', requiredSkill: 'sec-iam-auth', completed: false, evidencePrompt: 'Submit auth controller and token verification middleware.' },
      { id: 'sa-3', title: 'Role Guard Middleware', description: 'Write requireRole(["admin", "manager"]) middleware preventing unauthorized resource access.', requiredSkill: 'web-node', completed: false, evidencePrompt: 'Provide RBAC middleware code and unit test output.' },
    ],
  },
  {
    id: 'proj-ai-customer-rag',
    title: 'AI Customer Support Knowledge Agent (RAG)',
    difficulty: 'Advanced',
    domain: 'Artificial Intelligence & Cloud',
    description: 'Architect a production-grade question-answering agent that retrieves factual context from technical documentation and responds with citations.',
    objectives: [
      'Ingest and chunk markdown/PDF manuals into dense vector embeddings',
      'Execute top-k cosine similarity queries via Vector Store',
      'Prompt LLM with strict grounding instructions to eliminate hallucinations',
    ],
    requiredSkills: [
      { skillId: 'ai-rag', skillName: 'RAG & Vector Databases', minLevel: 65 },
      { skillId: 'ai-genai-llm', skillName: 'GenAI & LLMs', minLevel: 60 },
      { skillId: 'ai-prompt-eng', skillName: 'Prompt Engineering', minLevel: 60 },
      { skillId: 'cloud-docker', skillName: 'Docker & Containers', minLevel: 50 },
    ],
    tasks: [
      { id: 'rag-1', title: 'Document Ingestion & Chunking', description: 'Develop ingestion pipeline breaking knowledge docs into 500-token chunks with 50-token overlap.', requiredSkill: 'ai-rag', completed: false, evidencePrompt: 'Provide pipeline code and embedding sample.' },
      { id: 'rag-2', title: 'Context Grounded Generation', description: 'Inject retrieved chunks into Gemini prompt with strict citations and guardrails.', requiredSkill: 'ai-prompt-eng', completed: false, evidencePrompt: 'Provide prompt template and test conversation logs.' },
      { id: 'rag-3', title: 'Docker Containerization', description: 'Write a multi-stage Dockerfile packaging the full RAG backend with minimal image footprint.', requiredSkill: 'cloud-docker', completed: false, evidencePrompt: 'Submit Dockerfile and docker build logs.' },
    ],
  },
];

export const SEED_COMPANY_ORG: CompanyOrg = {
  id: 'org-cloudcorp',
  name: 'NextGen Cloud Corp',
  domain: 'nextgencloud.io',
  adminUserId: 'usr-admin-1',
  createdAt: '2026-01-15T09:00:00Z',
};

export const SEED_COMPANY_PROJECTS: CompanyProject[] = [
  {
    id: 'cproj-ai-support',
    orgId: 'org-cloudcorp',
    title: 'Enterprise AI Customer Support Platform',
    description: 'Customer facing autonomous multi-tier support platform integrating GenAI RAG, vector search, cloud microservices, and secure customer portal.',
    targetDeadline: '2026-12-15',
    requiredSkills: [
      { skillId: 'web-react', skillName: 'React', category: 'Web', targetScore: 70, weight: 20 },
      { skillId: 'web-node', skillName: 'Node.js & Express', category: 'Web', targetScore: 75, weight: 20 },
      { skillId: 'ai-rag', skillName: 'RAG & Vector Databases', category: 'AI', targetScore: 75, weight: 25 },
      { skillId: 'ai-genai-llm', skillName: 'GenAI & LLMs', category: 'AI', targetScore: 70, weight: 20 },
      { skillId: 'cloud-docker', skillName: 'Docker & Containers', category: 'Cloud', targetScore: 65, weight: 15 },
    ],
    assignedEmployeeIds: ['usr-emp-alex', 'usr-emp-priya'],
  },
];

export const SEED_PLACEMENT_QUESTIONS: PlacementMockQuestion[] = [
  {
    id: 'pmq-1',
    section: 'Aptitude',
    topic: 'Time & Work',
    question: 'Pipe A can fill a tank in 8 hours and Pipe B can empty it in 12 hours. If both pipes are opened simultaneously, in how many hours will the tank be full?',
    options: ['16 hours', '24 hours', '20 hours', '18 hours'],
    correctAnswer: 1, // 24 hours
    explanation: 'Net filling rate = 1/8 - 1/12 = (3 - 2)/24 = 1/24 tank per hour. Therefore, full in 24 hours.',
  },
  {
    id: 'pmq-2',
    section: 'Technical',
    topic: 'Operating Systems',
    question: 'Which of the following conditions is NOT a necessary condition for a deadlock to occur in an operating system?',
    options: ['Mutual Exclusion', 'Hold and Wait', 'Preemption Allowed', 'Circular Wait'],
    correctAnswer: 2, // Preemption Allowed
    explanation: 'The four Coffman conditions for deadlock are: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. If preemption is allowed, deadlocks are prevented.',
  },
  {
    id: 'pmq-3',
    section: 'Technical',
    topic: 'DBMS',
    question: 'In relational database theory, which normal form eliminates transitive functional dependencies for non-prime attributes?',
    options: ['First Normal Form (1NF)', 'Second Normal Form (2NF)', 'Third Normal Form (3NF)', 'Boyce-Codd Normal Form (BCNF)'],
    correctAnswer: 2, // 3NF
    explanation: '2NF eliminates partial dependencies. 3NF eliminates transitive dependencies X -> Y -> Z where Z is non-prime.',
  },
  {
    id: 'pmq-4',
    section: 'SQL',
    topic: 'Window Functions',
    question: 'Which SQL window function assigns a rank to each row within a partition, leaving gaps in rank values when there are ties?',
    options: ['ROW_NUMBER()', 'DENSE_RANK()', 'RANK()', 'LEAD()'],
    correctAnswer: 2, // RANK()
    explanation: 'RANK() leaves gaps (e.g. 1, 2, 2, 4), while DENSE_RANK() assigns consecutive numbers without gaps (e.g. 1, 2, 2, 3).',
  },
  {
    id: 'pmq-5',
    section: 'Coding',
    topic: 'Time Complexity',
    question: 'What is the average time complexity of searching an element in a balanced Binary Search Tree (AVL / Red-Black Tree)?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    correctAnswer: 1, // O(log n)
    explanation: 'Because the height of a balanced BST with n nodes is strictly bounded by O(log n), searches take O(log n) time.',
  },
];
