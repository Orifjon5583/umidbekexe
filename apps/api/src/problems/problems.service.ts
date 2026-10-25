import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ProgrammingLanguage, ProblemDifficulty } from '@codepractice/shared-types';

@Injectable()
export class ProblemsService {
  constructor(private prisma: PrismaService) {}

  async findAll(teacherOnly = false) {
    if (this.prisma.isConnected) {
      try {
        return await this.prisma.problem.findMany({
          where: teacherOnly ? undefined : { isActive: true },
          include: { _count: { select: { testCases: true } } },
          orderBy: { createdAt: 'desc' },
        });
      } catch {}
    }
    return this.prisma.memoryStore.problems;
  }

  async findOneForTeacher(id: string) {
    if (this.prisma.isConnected) {
      try {
        const problem = await this.prisma.problem.findUnique({
          where: { id },
          include: { testCases: { orderBy: { orderIndex: 'asc' } } },
        });
        if (problem) return problem;
      } catch {}
    }
    const memProblem = this.prisma.memoryStore.problems.find((p) => p.id === id);
    if (!memProblem) throw new NotFoundException('Masala topilmadi');
    const tests = this.prisma.memoryStore.testCases.filter((tc) => tc.problemId === id);
    return { ...memProblem, testCases: tests };
  }

  async findOneForStudent(id: string) {
    if (this.prisma.isConnected) {
      try {
        const problem = await this.prisma.problem.findUnique({
          where: { id, isActive: true },
          include: {
            testCases: {
              where: { isHidden: false },
              orderBy: { orderIndex: 'asc' },
            },
          },
        });
        if (problem) return problem;
      } catch {}
    }
    const memProblem = this.prisma.memoryStore.problems.find((p) => p.id === id);
    if (!memProblem) throw new NotFoundException('Masala topilmadi yoki faol emas');
    const visibleTests = this.prisma.memoryStore.testCases.filter(
      (tc) => tc.problemId === id && !tc.isHidden,
    );
    return { ...memProblem, testCases: visibleTests };
  }

  async create(data: any, createdBy: string) {
    if (this.prisma.isConnected) {
      try {
        return await this.prisma.problem.create({
          data: {
            title: data.title,
            statement: data.statement,
            inputDescription: data.inputDescription || '',
            outputDescription: data.outputDescription || '',
            sampleInput: data.sampleInput || '',
            sampleOutput: data.sampleOutput || '',
            language: data.language as ProgrammingLanguage,
            difficulty: data.difficulty as ProblemDifficulty,
            timeLimitMs: data.timeLimitMs || 2000,
            memoryLimitMb: data.memoryLimitMb || 128,
            createdBy,
            testCases: data.testCases?.length
              ? {
                  create: data.testCases.map((tc: any, idx: number) => ({
                    inputData: tc.inputData,
                    expectedOutput: tc.expectedOutput,
                    isHidden: Boolean(tc.isHidden),
                    orderIndex: idx,
                  })),
                }
              : undefined,
          },
          include: { testCases: true },
        });
      } catch {}
    }
    const created = {
      id: `prob-${Date.now()}`,
      ...data,
      version: 1,
      isActive: true,
      createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.prisma.memoryStore.problems.push(created);
    return created;
  }

  async update(id: string, data: any) {
    if (this.prisma.isConnected) {
      try {
        return await this.prisma.problem.update({
          where: { id },
          data: { ...data, version: { increment: 1 } },
        });
      } catch {}
    }
    const p = this.prisma.memoryStore.problems.find((item) => item.id === id);
    if (p) Object.assign(p, data);
    return p;
  }

  async addTestCase(problemId: string, testCase: { inputData: string; expectedOutput: string; isHidden: boolean }) {
    if (this.prisma.isConnected) {
      try {
        const count = await this.prisma.testCase.count({ where: { problemId } });
        return await this.prisma.testCase.create({
          data: {
            problemId,
            inputData: testCase.inputData,
            expectedOutput: testCase.expectedOutput,
            isHidden: testCase.isHidden,
            orderIndex: count,
          },
        });
      } catch {}
    }
    const tc = { id: `tc-${Date.now()}`, problemId, ...testCase, orderIndex: 0 };
    this.prisma.memoryStore.testCases.push(tc);
    return tc;
  }

  async deleteTestCase(testId: string) {
    if (this.prisma.isConnected) {
      try {
        return await this.prisma.testCase.delete({ where: { id: testId } });
      } catch {}
    }
    this.prisma.memoryStore.testCases = this.prisma.memoryStore.testCases.filter((tc) => tc.id !== testId);
  }
}
