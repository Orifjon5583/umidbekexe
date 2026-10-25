import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { TeacherDashboardStats } from '@codepractice/shared-types';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getTeacherDashboard(): Promise<TeacherDashboardStats> {
    const totalStudents = await this.prisma.user.count({ where: { role: 'student' } });

    const now = new Date();
    const activeAssignments = await this.prisma.assignment.count({
      where: {
        status: 'published',
        dueAt: { gte: now },
      },
    });

    const overdueAssignments = await this.prisma.assignment.count({
      where: {
        status: 'published',
        dueAt: { lt: now },
      },
    });

    const completedAssignments = await this.prisma.assignment.count({
      where: { status: 'archived' },
    });

    const recentSubmissions = await this.prisma.submission.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        student: { select: { fullName: true } },
        assignment: {
          select: {
            title: true,
            group: { select: { name: true } },
          },
        },
        problem: { select: { title: true } },
      },
    });

    return {
      totalStudents,
      activeAssignments,
      completedAssignments,
      overdueAssignments,
      recentSubmissions: recentSubmissions.map((s) => ({
        id: s.id,
        studentName: s.student.fullName,
        groupName: s.assignment.group.name,
        assignmentTitle: s.assignment.title,
        problemTitle: s.problem.title,
        status: s.status,
        passedTests: s.passedTests,
        totalTests: s.totalTests,
        submittedAt: s.createdAt.toISOString(),
      })),
    };
  }

  async getGroupProgress(groupId: string) {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: {
          include: {
            student: {
              select: { id: true, fullName: true, username: true },
            },
          },
        },
        assignments: {
          include: {
            assignmentProblems: true,
            submissions: true,
            studentProgress: true,
          },
        },
      },
    });

    if (!group) throw new NotFoundException('Guruh topilmadi');

    const result = group.members.map((m) => {
      const student = m.student;
      const assignmentStats = group.assignments.map((a) => {
        const totalProblems = a.assignmentProblems.length;
        const completed = a.studentProgress.filter(
          (sp) => sp.studentId === student.id && sp.status === 'completed',
        ).length;
        const progressPercentage = totalProblems > 0 ? Math.round((completed / totalProblems) * 100) : 0;
        return {
          assignmentId: a.id,
          assignmentTitle: a.title,
          totalProblems,
          completedProblems: completed,
          progressPercentage,
        };
      });

      return {
        studentId: student.id,
        studentName: student.fullName,
        username: student.username,
        assignments: assignmentStats,
      };
    });

    return {
      groupId: group.id,
      groupName: group.name,
      students: result,
    };
  }

  async getStudentProgressReport(studentId: string) {
    const student = await this.prisma.user.findUnique({
      where: { id: studentId },
      include: {
        groupMembers: {
          include: { group: true },
        },
        studentProgress: {
          include: {
            problem: { select: { title: true, difficulty: true, language: true } },
            assignment: { select: { title: true, dueAt: true } },
          },
        },
        submissions: {
          take: 20,
          orderBy: { createdAt: 'desc' },
          include: {
            problem: { select: { title: true } },
            assignment: { select: { title: true } },
          },
        },
      },
    });

    if (!student) throw new NotFoundException('O‘quvchi topilmadi');

    return {
      student: {
        id: student.id,
        fullName: student.fullName,
        username: student.username,
        groups: student.groupMembers.map((gm) => gm.group.name),
      },
      progress: student.studentProgress.map((sp) => ({
        problemTitle: sp.problem.title,
        assignmentTitle: sp.assignment.title,
        difficulty: sp.problem.difficulty,
        language: sp.language,
        status: sp.status,
        updatedAt: sp.updatedAt.toISOString(),
      })),
      recentSubmissions: student.submissions.map((s) => ({
        id: s.id,
        assignmentTitle: s.assignment.title,
        problemTitle: s.problem.title,
        status: s.status,
        passedTests: s.passedTests,
        totalTests: s.totalTests,
        executionTimeMs: s.executionTimeMs,
        peakMemoryMb: Math.round(Number(s.peakMemoryBytes) / (1024 * 1024)),
        createdAt: s.createdAt.toISOString(),
      })),
    };
  }

  async exportCsv(groupId?: string): Promise<string> {
    const submissions = await this.prisma.submission.findMany({
      where: groupId ? { assignment: { groupId } } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        student: { select: { fullName: true, username: true } },
        assignment: { select: { title: true, group: { select: { name: true } } } },
        problem: { select: { title: true, language: true } },
      },
    });

    const header = [
      'Topshiriq ID',
      'O‘quvchi',
      'Login',
      'Guruh',
      'Vazifa',
      'Masala',
      'Til',
      'Holat',
      'O‘tgan testlar',
      'Jami testlar',
      'Bajarilish vaqti (ms)',
      'CPU vaqti (ms)',
      'Xotira (bayt)',
      'Sana',
    ].join(',');

    const rows = submissions.map((s) => {
      return [
        `"${s.id}"`,
        `"${s.student.fullName}"`,
        `"${s.student.username}"`,
        `"${s.assignment.group.name}"`,
        `"${s.assignment.title}"`,
        `"${s.problem.title}"`,
        `"${s.problem.language}"`,
        `"${s.status}"`,
        s.passedTests,
        s.totalTests,
        s.executionTimeMs,
        s.cpuTimeMs,
        Number(s.peakMemoryBytes),
        `"${s.createdAt.toISOString()}"`,
      ].join(',');
    });

    return [header, ...rows].join('\n');
  }
}
