// CodePractice Shared Types

export type UserRole = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  fullName: string;
  username: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface TokenPayload {
  sub: string;
  username: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface Group {
  id: string;
  name: string;
  studentCount?: number;
  activeAssignmentsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface GroupWithMembers extends Group {
  members: {
    student: User;
    joinedAt: string;
  }[];
}

export type ProgrammingLanguage = 'python' | 'cpp';
export type ProblemDifficulty = 'easy' | 'medium' | 'hard';

export interface TestCase {
  id: string;
  problemId: string;
  inputData: string;
  expectedOutput: string;
  isHidden: boolean;
  orderIndex: number;
}

export interface Problem {
  id: string;
  title: string;
  statement: string;
  inputDescription: string;
  outputDescription: string;
  sampleInput: string;
  sampleOutput: string;
  language: ProgrammingLanguage;
  difficulty: ProblemDifficulty;
  timeLimitMs: number;
  memoryLimitMb: number;
  version: number;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  testCases?: TestCase[];
}

export type AssignmentStatus = 'draft' | 'published' | 'archived';

export interface Assignment {
  id: string;
  title: string;
  description: string;
  groupId: string;
  groupName?: string;
  startsAt: string;
  dueAt: string;
  status: AssignmentStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  problems?: Problem[];
  totalProblems?: number;
  progressPercentage?: number;
  studentStatus?: 'new' | 'in_progress' | 'completed' | 'overdue';
}

export type ProgressStatus = 'not_started' | 'in_progress' | 'completed';

export interface StudentProgress {
  id: string;
  assignmentId: string;
  problemId: string;
  studentId: string;
  status: ProgressStatus;
  draftCode: string;
  language: ProgrammingLanguage;
  updatedAt: string;
}

export type SubmissionStatus =
  | 'accepted'
  | 'wrong_answer'
  | 'compile_error'
  | 'runtime_error'
  | 'time_limit_exceeded'
  | 'memory_limit_exceeded'
  | 'output_limit_exceeded'
  | 'runner_error';

export interface TestResultItem {
  testNumber: number;
  testCaseId?: string;
  status: 'passed' | 'failed' | 'error' | 'timeout';
  executionTimeMs: number;
  errorSummary?: string;
  actualOutput?: string;
  expectedOutput?: string;
  inputData?: string;
  isHidden: boolean;
}

export interface RunnerResult {
  status: SubmissionStatus;
  stdout: string;
  stderr: string;
  executionTimeMs: number;
  cpuTimeMs: number;
  peakMemoryBytes: number;
  passedTests: number;
  totalTests: number;
  testResults: TestResultItem[];
  error?: string;
}

export interface Submission {
  id: string;
  studentId: string;
  studentName?: string;
  assignmentId: string;
  assignmentTitle?: string;
  problemId: string;
  problemTitle?: string;
  language: ProgrammingLanguage;
  sourceCode: string;
  status: SubmissionStatus;
  passedTests: number;
  totalTests: number;
  executionTimeMs: number;
  cpuTimeMs: number;
  peakMemoryBytes: number;
  createdAt: string;
  testResults?: TestResultItem[];
}

export type AIRequestType =
  | 'explain_problem'
  | 'explain_code'
  | 'explain_error'
  | 'hint'
  | 'explain_test';

export interface AIRequestDto {
  problemId: string;
  requestType: AIRequestType;
  studentQuestion?: string;
  currentCode?: string;
  errorMessage?: string;
  testResultsSummary?: string;
}

export interface AIResponseDto {
  response: string;
  remainingDailyTokens?: number;
  warning?: string;
}

export interface TeacherDashboardStats {
  totalStudents: number;
  activeAssignments: number;
  completedAssignments: number;
  overdueAssignments: number;
  recentSubmissions: {
    id: string;
    studentName: string;
    groupName: string;
    assignmentTitle: string;
    problemTitle: string;
    status: SubmissionStatus;
    passedTests: number;
    totalTests: number;
    submittedAt: string;
  }[];
}

export interface StudentDashboardDto {
  studentName: string;
  activeAssignments: Assignment[];
  completedAssignments: Assignment[];
  overdueAssignments: Assignment[];
}
