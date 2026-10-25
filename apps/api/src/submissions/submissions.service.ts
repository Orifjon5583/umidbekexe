import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { SubmissionStatus, ProgrammingLanguage } from '@codepractice/shared-types';

@Injectable()
export class SubmissionsService {
  constructor(private prisma: PrismaService) {}

  async createSubmission(
    studentId: string,
    problemId: string,
    data: {
      assignmentId: string;
      language: ProgrammingLanguage;
      sourceCode: string;
      runnerResult: any;
    },
  ) {
    const { assignmentId, language, sourceCode, runnerResult } = data;

    const submission = await this.prisma.submission.create({
      data: {
        studentId,
        assignmentId,
        problemId,
        language,
        sourceCode,
        status: runnerResult.status as SubmissionStatus,
        passedTests: runnerResult.passedTests || 0,
        totalTests: runnerResult.totalTests || 0,
        executionTimeMs: runnerResult.executionTimeMs || 0,
        cpuTimeMs: runnerResult.cpuTimeMs || 0,
        peakMemoryBytes: BigInt(runnerResult.peakMemoryBytes || 0),
        testResults: runnerResult.testResults?.length
          ? {
              create: runnerResult.testResults.map((tr: any) => ({
                testCaseId: tr.testCaseId || null,
                status: tr.status,
                executionTimeMs: tr.executionTimeMs || 0,
                errorSummary: tr.errorSummary || null,
              })),
            }
          : undefined,
      },
      include: {
        testResults: true,
      },
    });

    // Agar barcha testlar muvaffaqiyatli topshirilgan bo'lsa, progressni 'completed' qilish
    if (runnerResult.status === 'accepted') {
      await this.prisma.studentProgress.upsert({
        where: {
          assignmentId_problemId_studentId: {
            assignmentId,
            problemId,
            studentId,
          },
        },
        create: {
          assignmentId,
          problemId,
          studentId,
          status: 'completed',
          draftCode: sourceCode,
          language,
        },
        update: {
          status: 'completed',
          draftCode: sourceCode,
          language,
        },
      });
    }

    return {
      ...submission,
      peakMemoryBytes: Number(submission.peakMemoryBytes),
    };
  }

  async findOne(id: string, currentUserId: string, userRole: string) {
    const submission = await this.prisma.submission.findUnique({
      where: { id },
      include: {
        student: { select: { id: true, fullName: true, username: true } },
        problem: { select: { id: true, title: true } },
        assignment: { select: { id: true, title: true } },
        testResults: true,
      },
    });

    if (!submission) throw new NotFoundException('Topshiriq urinishi topilmadi');

    // O'quvchi faqat o'z urinishini ko'ra oladi
    if (userRole === 'student' && submission.studentId !== currentUserId) {
      throw new NotFoundException('Topshiriq urinishi topilmadi');
    }

    return {
      ...submission,
      peakMemoryBytes: Number(submission.peakMemoryBytes),
    };
  }
}
