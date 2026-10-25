import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ProgrammingLanguage, ProgressStatus } from '@codepractice/shared-types';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  async getProgress(assignmentId: string, problemId: string, studentId: string) {
    if (this.prisma.isConnected) {
      try {
        return await this.prisma.studentProgress.findUnique({
          where: {
            assignmentId_problemId_studentId: {
              assignmentId,
              problemId,
              studentId,
            },
          },
        });
      } catch {}
    }
    return this.prisma.memoryStore.studentProgress.find(
      (sp) => sp.assignmentId === assignmentId && sp.problemId === problemId && sp.studentId === studentId,
    ) || null;
  }

  async saveProgress(data: {
    assignmentId: string;
    problemId: string;
    studentId: string;
    draftCode: string;
    language: ProgrammingLanguage;
    status?: ProgressStatus;
  }) {
    if (this.prisma.isConnected) {
      try {
        return await this.prisma.studentProgress.upsert({
          where: {
            assignmentId_problemId_studentId: {
              assignmentId: data.assignmentId,
              problemId: data.problemId,
              studentId: data.studentId,
            },
          },
          create: {
            assignmentId: data.assignmentId,
            problemId: data.problemId,
            studentId: data.studentId,
            draftCode: data.draftCode,
            language: data.language,
            status: data.status || 'in_progress',
          },
          update: {
            draftCode: data.draftCode,
            language: data.language,
            status: data.status || undefined,
          },
        });
      } catch {}
    }

    const existing = this.prisma.memoryStore.studentProgress.find(
      (sp) => sp.assignmentId === data.assignmentId && sp.problemId === data.problemId && sp.studentId === data.studentId,
    );
    if (existing) {
      existing.draftCode = data.draftCode;
      existing.language = data.language;
      if (data.status) existing.status = data.status;
      return existing;
    }
    const created = {
      id: `sp-${Date.now()}`,
      ...data,
      status: data.status || 'in_progress',
      updatedAt: new Date(),
    };
    this.prisma.memoryStore.studentProgress.push(created);
    return created;
  }

  async getStudentDashboard(studentId: string) {
    if (this.prisma.isConnected) {
      try {
        const student = await this.prisma.user.findUnique({
          where: { id: studentId },
          select: { fullName: true },
        });

        const studentGroups = await this.prisma.groupMember.findMany({
          where: { studentId },
          select: { groupId: true },
        });
        const groupIds = studentGroups.map((g) => g.groupId);

        const assignments = await this.prisma.assignment.findMany({
          where: {
            groupId: { in: groupIds },
            status: 'published',
          },
          include: {
            group: { select: { name: true } },
            assignmentProblems: true,
            studentProgress: {
              where: { studentId },
            },
          },
          orderBy: { dueAt: 'asc' },
        });

        const now = new Date();
        const formatted = assignments.map((a) => {
          const totalProblems = a.assignmentProblems.length;
          const completedProblems = a.studentProgress.filter((p) => p.status === 'completed').length;
          const progressPercentage = totalProblems > 0 ? Math.round((completedProblems / totalProblems) * 100) : 0;

          let studentStatus: 'new' | 'in_progress' | 'completed' | 'overdue' = 'new';
          if (completedProblems === totalProblems && totalProblems > 0) {
            studentStatus = 'completed';
          } else if (new Date(a.dueAt) < now) {
            studentStatus = 'overdue';
          } else if (a.studentProgress.length > 0) {
            studentStatus = 'in_progress';
          }

          return {
            id: a.id,
            title: a.title,
            groupName: a.group.name,
            startsAt: a.startsAt.toISOString(),
            dueAt: a.dueAt.toISOString(),
            totalProblems,
            completedProblems,
            progressPercentage,
            studentStatus,
          };
        });

        return {
          studentName: student?.fullName || 'O‘quvchi',
          assignments: formatted,
        };
      } catch {}
    }

    // Fallback: In-memory store
    const memStudent = this.prisma.memoryStore.users.find((u) => u.id === studentId);
    const memAssignments = this.prisma.memoryStore.assignments.map((a) => {
      const totalProblems = this.prisma.memoryStore.assignmentProblems.filter((ap) => ap.assignmentId === a.id).length;
      return {
        id: a.id,
        title: a.title,
        groupName: 'Guruh-101 (Python & C++)',
        startsAt: a.startsAt.toISOString(),
        dueAt: a.dueAt.toISOString(),
        totalProblems,
        completedProblems: 0,
        progressPercentage: 0,
        studentStatus: 'new',
      };
    });

    return {
      studentName: memStudent?.fullName || 'Alisher Omonov',
      assignments: memAssignments,
    };
  }
}
