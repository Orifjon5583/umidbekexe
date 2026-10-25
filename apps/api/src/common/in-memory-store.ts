import * as bcrypt from 'bcryptjs';

export interface MemoryUser {
  id: string;
  fullName: string;
  username: string;
  passwordHash: string;
  role: 'admin' | 'teacher' | 'student';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class InMemoryStore {
  private static instance: InMemoryStore;

  public users: MemoryUser[] = [];
  public groups: any[] = [];
  public groupMembers: any[] = [];
  public problems: any[] = [];
  public testCases: any[] = [];
  public assignments: any[] = [];
  public assignmentProblems: any[] = [];
  public studentProgress: any[] = [];
  public submissions: any[] = [];
  public sessions: any[] = [];
  public aiInteractions: any[] = [];

  private initialized = false;

  private constructor() {}

  public static getInstance(): InMemoryStore {
    if (!InMemoryStore.instance) {
      InMemoryStore.instance = new InMemoryStore();
      InMemoryStore.instance.initDefaultData();
    }
    return InMemoryStore.instance;
  }

  private initDefaultData() {
    if (this.initialized) return;
    this.initialized = true;

    const adminHash = bcrypt.hashSync('Admin123!', 8);
    const teacherHash = bcrypt.hashSync('Teacher123!', 8);
    const studentHash = bcrypt.hashSync('Student123!', 8);

    const adminId = 'user-admin-1';
    const teacherId = 'user-teacher-1';
    const student1Id = 'user-student-1';
    const student2Id = 'user-student-2';
    const student3Id = 'user-student-3';

    this.users.push(
      {
        id: adminId,
        fullName: 'Bosh Administrator',
        username: 'admin',
        passwordHash: adminHash,
        role: 'admin',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: teacherId,
        fullName: 'Rustam Qodirov',
        username: 'teacher1',
        passwordHash: teacherHash,
        role: 'teacher',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: student1Id,
        fullName: 'Alisher Omonov',
        username: 'student1',
        passwordHash: studentHash,
        role: 'student',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: student2Id,
        fullName: 'Jasur Bekmirzayev',
        username: 'student2',
        passwordHash: studentHash,
        role: 'student',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: student3Id,
        fullName: 'Madina Karimova',
        username: 'student3',
        passwordHash: studentHash,
        role: 'student',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    );

    const groupId = 'group-101';
    this.groups.push({
      id: groupId,
      name: 'Guruh-101 (Python & C++)',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    this.groupMembers.push(
      { id: 'gm-1', groupId, studentId: student1Id, joinedAt: new Date() },
      { id: 'gm-2', groupId, studentId: student2Id, joinedAt: new Date() },
      { id: 'gm-3', groupId, studentId: student3Id, joinedAt: new Date() },
    );

    const p1Id = 'prob-1';
    const p2Id = 'prob-2';
    const p3Id = 'prob-3';

    this.problems.push(
      {
        id: p1Id,
        title: 'Ikki son yig‘indisi',
        statement: 'Bitta qatorda probel bilan ajratilgan ikkita butun son A va B beriladi. Ularning yig‘indisini ekranga chiqaring.',
        inputDescription: 'Bitta qatorda ikkita butun son: -10^9 <= A, B <= 10^9',
        outputDescription: 'A va B sonlarining yig‘indisi',
        sampleInput: '5 7',
        sampleOutput: '12',
        language: 'python',
        difficulty: 'easy',
        timeLimitMs: 1500,
        memoryLimitMb: 64,
        version: 1,
        isActive: true,
        createdBy: teacherId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: p2Id,
        title: 'Faktorialni hisoblash',
        statement: 'N musbat butun soni berilgan. N faktorial (N!) qiymatini hisoblang.',
        inputDescription: 'Bitta butun son N (0 <= N <= 12)',
        outputDescription: 'N faktorial qiymati',
        sampleInput: '5',
        sampleOutput: '120',
        language: 'python',
        difficulty: 'easy',
        timeLimitMs: 1500,
        memoryLimitMb: 64,
        version: 1,
        isActive: true,
        createdBy: teacherId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: p3Id,
        title: 'Massivdagi maksimal element',
        statement: 'Massiv elementlari soni N va massiv elementlari berilgan. Eng katta elementni chiqaring.',
        inputDescription: 'Birinchi qatorda N. Ikkinchi qatorda N ta butun son.',
        outputDescription: 'Eng katta element',
        sampleInput: "5\n3 7 2 9 4",
        sampleOutput: '9',
        language: 'cpp',
        difficulty: 'medium',
        timeLimitMs: 2000,
        memoryLimitMb: 128,
        version: 1,
        isActive: true,
        createdBy: teacherId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    );

    // Test cases for problem 1 (10 test cases)
    this.testCases.push(
      { id: 'tc-1', problemId: p1Id, inputData: '5 7', expectedOutput: '12', isHidden: false, orderIndex: 0 },
      { id: 'tc-2', problemId: p1Id, inputData: '10 20', expectedOutput: '30', isHidden: false, orderIndex: 1 },
      { id: 'tc-3', problemId: p1Id, inputData: '-5 5', expectedOutput: '0', isHidden: false, orderIndex: 2 },
      { id: 'tc-4', problemId: p1Id, inputData: '0 0', expectedOutput: '0', isHidden: true, orderIndex: 3 },
      { id: 'tc-5', problemId: p1Id, inputData: '-10 -25', expectedOutput: '-35', isHidden: true, orderIndex: 4 },
      { id: 'tc-6', problemId: p1Id, inputData: '100000 250000', expectedOutput: '350000', isHidden: true, orderIndex: 5 },
      { id: 'tc-7', problemId: p1Id, inputData: '999999999 1', expectedOutput: '1000000000', isHidden: true, orderIndex: 6 },
      { id: 'tc-8', problemId: p1Id, inputData: '-500 1200', expectedOutput: '700', isHidden: true, orderIndex: 7 },
      { id: 'tc-9', problemId: p1Id, inputData: '42 0', expectedOutput: '42', isHidden: true, orderIndex: 8 },
      { id: 'tc-10', problemId: p1Id, inputData: '12345 67890', expectedOutput: '80235', isHidden: true, orderIndex: 9 },
    );

    // Assignment
    const assignId = 'assign-1';
    const now = new Date();
    this.assignments.push({
      id: assignId,
      title: '1-vazifa: Algoritmik mashqlar (Python & C++)',
      description: 'Darsdan keyingi majburiy amaliy mashqlar. Har bir masalani diqqat bilan o‘qib chiqing.',
      groupId,
      startsAt: new Date(now.getTime() - 24 * 3600 * 1000),
      dueAt: new Date(now.getTime() + 7 * 24 * 3600 * 1000),
      status: 'published',
      createdBy: teacherId,
      createdAt: now,
      updatedAt: now,
    });

    this.assignmentProblems.push(
      { id: 'ap-1', assignmentId: assignId, problemId: p1Id, orderIndex: 0 },
      { id: 'ap-2', assignmentId: assignId, problemId: p2Id, orderIndex: 1 },
      { id: 'ap-3', assignmentId: assignId, problemId: p3Id, orderIndex: 2 },
    );
  }
}
