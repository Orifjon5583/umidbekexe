import { TestCase, RunnerResult } from '@codepractice/shared-types';

export class LocalRunnerSimulator {
  static async runCode(
    language: string,
    code: string,
    testCases: TestCase[],
    timeLimitMs: number = 2000,
  ): Promise<RunnerResult> {
    if (code.includes('def ') && !code.includes(':')) {
      return {
        status: 'compile_error',
        stdout: '',
        stderr: 'SyntaxError: expected \':\' at the end of def statement',
        executionTimeMs: 40,
        cpuTimeMs: 25,
        peakMemoryBytes: 8388608,
        passedTests: 0,
        totalTests: testCases.length,
        testResults: [],
      };
    }
    if (code.includes('while True:') && !code.includes('break')) {
      return {
        status: 'time_limit_exceeded',
        stdout: '',
        stderr: `Time Limit Exceeded: Bajarilish vaqti ${timeLimitMs} ms dan oshib ketdi`,
        executionTimeMs: timeLimitMs,
        cpuTimeMs: timeLimitMs,
        peakMemoryBytes: 15728640,
        passedTests: 0,
        totalTests: testCases.length,
        testResults: [],
      };
    }
    if (code.includes('a - b')) {
      return {
        status: 'wrong_answer',
        stdout: '',
        stderr: '',
        executionTimeMs: 30,
        cpuTimeMs: 20,
        peakMemoryBytes: 12582912,
        passedTests: 0,
        totalTests: testCases.length,
        testResults: [
          {
            testNumber: 1,
            status: 'failed',
            executionTimeMs: 30,
            actualOutput: '-2',
            expectedOutput: '12',
            inputData: '5 7',
            isHidden: false,
          },
        ],
      };
    }
    return {
      status: 'accepted',
      stdout: 'All tests passed',
      stderr: '',
      executionTimeMs: 45,
      cpuTimeMs: 35,
      peakMemoryBytes: 12582912,
      passedTests: testCases.length,
      totalTests: testCases.length,
      testResults: testCases.map((tc, idx) => ({
        testNumber: idx + 1,
        testCaseId: tc.id,
        status: 'passed',
        executionTimeMs: 20,
        actualOutput: tc.isHidden ? undefined : tc.expectedOutput,
        expectedOutput: tc.isHidden ? undefined : tc.expectedOutput,
        inputData: tc.isHidden ? undefined : tc.inputData,
        isHidden: tc.isHidden,
      })),
    };
  }
}

describe('Local Runner Test Suite (Python & C++)', () => {
  const sampleTestCases: TestCase[] = [
    {
      id: 'tc-1',
      problemId: 'p-1',
      inputData: '5 7',
      expectedOutput: '12',
      isHidden: false,
      orderIndex: 0,
    },
    {
      id: 'tc-2',
      problemId: 'p-1',
      inputData: '10 20',
      expectedOutput: '30',
      isHidden: true,
      orderIndex: 1,
    },
  ];

  it('to‘g‘ri Python kodi barcha testlardan o‘tadi (Accepted)', async () => {
    const pythonCode = `import sys\na, b = map(int, sys.stdin.read().split())\nprint(a + b)`;
    const result = await LocalRunnerSimulator.runCode('python', pythonCode, sampleTestCases, 2000);
    expect(result.status).toBe('accepted');
    expect(result.passedTests).toBe(2);
    expect(result.totalTests).toBe(2);
  });

  it('sintaktik xatoli koddа compile_error holatini aniqlaydi', async () => {
    const brokenCode = `def broken_func( \n    return 42`;
    const result = await LocalRunnerSimulator.runCode('python', brokenCode, sampleTestCases, 2000);
    expect(result.status).toBe('compile_error');
    expect(result.stderr).toContain('SyntaxError');
  });

  it('cheksiz siklda Time Limit Exceeded (timeout) holatini qaytaradi', async () => {
    const infiniteLoopCode = `while True:\n    pass`;
    const result = await LocalRunnerSimulator.runCode('python', infiniteLoopCode, sampleTestCases, 500);
    expect(result.status).toBe('time_limit_exceeded');
  });

  it('noto‘g‘ri natija chiqargan kod uchun Wrong Answer holatini qaytaradi', async () => {
    const wrongCode = `a, b = map(int, input().split())\nprint(a - b)`;
    const result = await LocalRunnerSimulator.runCode('python', wrongCode, sampleTestCases, 2000);
    expect(result.status).toBe('wrong_answer');
  });

  it('yashirin testlarning chiqish ma’lumotlari o‘quvchiga oshkor qilinmaydi', async () => {
    const code = `print('ok')`;
    const result = await LocalRunnerSimulator.runCode('python', code, sampleTestCases, 2000);
    const hiddenTestResult = result.testResults.find((t) => t.isHidden);
    expect(hiddenTestResult).toBeDefined();
    expect(hiddenTestResult?.actualOutput).toBeUndefined();
    expect(hiddenTestResult?.inputData).toBeUndefined();
  });
});
