import { execFile } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';

const execFileAsync = promisify(execFile);

export interface RunResult {
  status: 'accepted' | 'wrong_answer' | 'runtime_error' | 'time_limit_exceeded';
  passedTests: number;
  totalTests: number;
  score: number;
  executionTimeMs: number;
  output?: string;
  error?: string;
  testDetails: {
    input: string;
    expected: string;
    actual: string;
    passed: boolean;
    error?: string;
  }[];
}

export async function runCode(
  language: 'javascript' | 'python' | 'sql',
  code: string,
  testCases: { input: string; expectedOutput: string; isHidden?: boolean }[],
  sqlSchema?: string
): Promise<RunResult> {
  const startTime = Date.now();

  if (language === 'javascript') {
    return runJavaScript(code, testCases, startTime);
  } else if (language === 'python') {
    return runPython(code, testCases, startTime);
  } else if (language === 'sql') {
    return runSQL(code, testCases, sqlSchema || '', startTime);
  }

  return {
    status: 'runtime_error',
    passedTests: 0,
    totalTests: testCases.length,
    score: 0,
    executionTimeMs: Date.now() - startTime,
    error: `Unsupported language: ${language}`,
    testDetails: [],
  };
}

async function runJavaScript(
  code: string,
  testCases: { input: string; expectedOutput: string }[],
  startTime: number
): Promise<RunResult> {
  let passedCount = 0;
  const testDetails: RunResult['testDetails'] = [];

  const fnMatch = code.match(/function\s+([a-zA-Z0-9_$]+)/);
  const fnName = fnMatch ? fnMatch[1] : null;

  for (const tc of testCases) {
    const tmpFile = path.join(os.tmpdir(), `run_js_${crypto.randomUUID().slice(0, 8)}.cjs`);
    const script = `
${code}

try {
  let result;
  ${fnName ? `result = ${fnName}(${tc.input});` : `result = eval(${JSON.stringify(tc.input)});`}
  const output = typeof result === 'object' ? JSON.stringify(result) : String(result);
  process.stdout.write(output);
} catch (err) {
  process.stderr.write("ERR:" + (err.message || err));
  process.exit(1);
}
`;

    try {
      fs.writeFileSync(tmpFile, script, 'utf-8');
      const { stdout, stderr } = await execFileAsync('node', [tmpFile], { timeout: 3500 });
      const actual = stdout.trim();
      const expected = tc.expectedOutput.trim();

      let isMatch = actual === expected;
      try {
        const parsedActual = JSON.parse(actual);
        const parsedExpected = JSON.parse(expected);
        isMatch = JSON.stringify(parsedActual) === JSON.stringify(parsedExpected);
      } catch {
        // string match
      }

      if (isMatch) passedCount++;

      testDetails.push({
        input: tc.input,
        expected,
        actual: actual || (stderr ? `Error: ${stderr}` : 'No output'),
        passed: isMatch,
        error: stderr ? stderr.trim() : undefined,
      });
    } catch (err: any) {
      testDetails.push({
        input: tc.input,
        expected: tc.expectedOutput,
        actual: 'Error',
        passed: false,
        error: err.killed ? 'Time Limit Exceeded (3.5s)' : (err.stderr || err.message),
      });
    } finally {
      if (fs.existsSync(tmpFile)) {
        try { fs.unlinkSync(tmpFile); } catch {}
      }
    }
  }

  const duration = Date.now() - startTime;
  const isAccepted = passedCount === testCases.length;
  const anyTimeout = testDetails.some((t) => t.error?.includes('Time Limit'));

  return {
    status: isAccepted ? 'accepted' : anyTimeout ? 'time_limit_exceeded' : 'wrong_answer',
    passedTests: passedCount,
    totalTests: testCases.length,
    score: testCases.length > 0 ? Math.round((passedCount / testCases.length) * 100) : 100,
    executionTimeMs: duration,
    testDetails,
  };
}

async function runPython(
  code: string,
  testCases: { input: string; expectedOutput: string }[],
  startTime: number
): Promise<RunResult> {
  let passedCount = 0;
  const testDetails: RunResult['testDetails'] = [];

  const fnMatch = code.match(/def\s+([a-zA-Z0-9_]+)\s*\(/);
  const fnName = fnMatch ? fnMatch[1] : null;

  for (const tc of testCases) {
    const tmpFile = path.join(os.tmpdir(), `run_py_${crypto.randomUUID().slice(0, 8)}.py`);
    const script = `
import json, sys

${code}

try:
    ${fnName ? `res = ${fnName}(${tc.input})` : `res = None`}
    if isinstance(res, (dict, list, tuple)):
        sys.stdout.write(json.dumps(res))
    elif isinstance(res, bool):
        sys.stdout.write(str(res).lower())
    else:
        sys.stdout.write(str(res))
except Exception as e:
    sys.stderr.write(str(e))
    sys.exit(1)
`;

    try {
      fs.writeFileSync(tmpFile, script, 'utf-8');
      const { stdout, stderr } = await execFileAsync('python3', [tmpFile], { timeout: 4000 });
      const actual = stdout.trim();
      const expected = tc.expectedOutput.trim();

      let isMatch = actual === expected;
      try {
        const parsedActual = JSON.parse(actual);
        const parsedExpected = JSON.parse(expected);
        isMatch = JSON.stringify(parsedActual) === JSON.stringify(parsedExpected);
      } catch {
        // string match
      }

      if (isMatch) passedCount++;

      testDetails.push({
        input: tc.input,
        expected,
        actual: actual || (stderr ? `Error: ${stderr}` : 'No output'),
        passed: isMatch,
        error: stderr ? stderr.trim() : undefined,
      });
    } catch (err: any) {
      testDetails.push({
        input: tc.input,
        expected: tc.expectedOutput,
        actual: 'Error',
        passed: false,
        error: err.killed ? 'Time Limit Exceeded (4.0s)' : (err.stderr || err.message),
      });
    } finally {
      if (fs.existsSync(tmpFile)) {
        try { fs.unlinkSync(tmpFile); } catch {}
      }
    }
  }

  const duration = Date.now() - startTime;
  const isAccepted = passedCount === testCases.length;

  return {
    status: isAccepted ? 'accepted' : 'wrong_answer',
    passedTests: passedCount,
    totalTests: testCases.length,
    score: testCases.length > 0 ? Math.round((passedCount / testCases.length) * 100) : 100,
    executionTimeMs: duration,
    testDetails,
  };
}

async function runSQL(
  code: string,
  testCases: { input: string; expectedOutput: string }[],
  schema: string,
  startTime: number
): Promise<RunResult> {
  const testDetails: RunResult['testDetails'] = [];
  let passedCount = 0;

  const tmpFile = path.join(os.tmpdir(), `run_sql_${crypto.randomUUID().slice(0, 8)}.py`);
  const pythonSqlRunner = `
import sqlite3, json, sys

try:
    conn = sqlite3.connect(":memory:")
    cur = conn.cursor()
    
    schema = ${JSON.stringify(schema)}
    cur.executescript(schema)
    
    user_query = ${JSON.stringify(code.trim().replace(/;+$/, ''))}
    cur.execute(user_query)
    
    columns = [col[0] for col in cur.description] if cur.description else []
    rows = cur.fetchall()
    
    result = []
    for r in rows:
        result.append(dict(zip(columns, r)))
        
    sys.stdout.write(json.dumps(result))
except Exception as e:
    sys.stderr.write(str(e))
    sys.exit(1)
`;

  try {
    fs.writeFileSync(tmpFile, pythonSqlRunner, 'utf-8');
    const { stdout, stderr } = await execFileAsync('python3', [tmpFile], { timeout: 3500 });
    const actual = stdout.trim();

    for (const tc of testCases) {
      const expected = tc.expectedOutput.trim();
      let isMatch = actual === expected;
      try {
        const parsedActual = JSON.parse(actual);
        const parsedExpected = JSON.parse(expected);
        isMatch = JSON.stringify(parsedActual) === JSON.stringify(parsedExpected);
      } catch {
        // string match
      }

      if (isMatch) passedCount++;

      testDetails.push({
        input: 'SQL Database Execution',
        expected,
        actual: actual || (stderr ? `Error: ${stderr}` : 'Empty result'),
        passed: isMatch,
        error: stderr ? stderr.trim() : undefined,
      });
    }
  } catch (err: any) {
    testDetails.push({
      input: 'SQL Database Execution',
      expected: testCases[0]?.expectedOutput || '',
      actual: 'SQL Execution Error',
      passed: false,
      error: err.stderr || err.message,
    });
  } finally {
    if (fs.existsSync(tmpFile)) {
      try { fs.unlinkSync(tmpFile); } catch {}
    }
  }

  const duration = Date.now() - startTime;
  return {
    status: passedCount === testCases.length ? 'accepted' : 'wrong_answer',
    passedTests: passedCount,
    totalTests: testCases.length,
    score: testCases.length > 0 ? Math.round((passedCount / testCases.length) * 100) : 0,
    executionTimeMs: duration,
    testDetails,
  };
}
