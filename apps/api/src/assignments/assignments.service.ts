import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class AssignmentsService {
  constructor(private prisma: PrismaService) {}

  async findAllForTeacher() {
    if (this.prisma.isConnected) {
      try {
        return await this.prisma.assignment.findMany({
          include: {
            group: { select: { id: true, name: true } },
            assignmentProblems: {
              include: {
                problem: { select: { id: true, title: true, difficulty: true, language: true } },
              },
              orderBy: { orderIndex: 'asc' },
            },
          },
          orderBy: { createdAt: 'desc' },
        });
      } catch {}
    }
    return this.prisma.memoryStore.assignments;
  }

  async findAllForStudent(studentId: string) {
    if (this.prisma.isConnected) {
      try {
        const studentGroups = await this.prisma.groupMember.findMany({
          where: { studentId },
          select: { groupId: true },
        });
        const groupIds = studentGroups.map((g) => g.groupId);
        const assignments = await this.prisma.assignment.findMany({
          where: { groupId: { in: groupIds }, status: 'published' },
          include: {
            group: { select: { id: true, name: true } },
            assignmentProblems: {
              include: {
                problem: { select: { id: true, title: true, difficulty: true, language: true } },
              },
              orderBy: { orderIndex: 'asc' },
            },
            studentProgress: { where: { studentId } },
          },
          orderBy: { dueAt: 'asc' },
        });
        return assignments.map((a) => ({
          id: a.id,
          title: a.title,
          description: a.description,
          groupId: a.groupId,
          groupName: a.group.name,
          startsAt: a.startsAt.toISOString(),
          dueAt: a.dueAt.toISOString(),
          status: a.status,
          totalProblems: a.assignmentProblems.length,
          completedProblems: 0,
          progressPercentage: 0,
          studentStatus: 'new',
          problems: a.assignmentProblems.map((ap) => ap.problem),
        }));
      } catch {}
    }

    return this.prisma.memoryStore.assignments.map((a) => {
      const aps = this.prisma.memoryStore.assignmentProblems.filter((ap) => ap.assignmentId === a.id);
      const problems = aps.map((ap) => this.prisma.memoryStore.problems.find((p) => p.id === ap.problemId)).filter(Boolean);
      return {
        id: a.id,
        title: a.title,
        description: a.description,
        groupId: a.groupId,
        groupName: 'Guruh-101 (Python & C++)',
        startsAt: a.startsAt.toISOString(),
        dueAt: a.dueAt.toISOString(),
        status: a.status,
        totalProblems: problems.length,
        completedProblems: 0,
        progressPercentage: 0,
        studentStatus: 'new',
        problems,
      };
    });
  }

  async findOneForStudent(assignmentId: string, studentId: string) {
    if (this.prisma.isConnected) {
      try {
        const assignment = await this.prisma.assignment.findUnique({
          where: { id: assignmentId },
          include: {
            group: { select: { id: true, name: true } },
            assignmentProblems: {
              include: { problem: true },
              orderBy: { orderIndex: 'asc' },
            },
            studentProgress: { where: { studentId } },
          },
        });
        if (assignment) {
          const problemsWithProgress = assignment.assignmentProblems.map((ap) => {
            const progress = assignment.studentProgress.find((p) => p.problemId === ap.problemId);
            return {
              ...ap.problem,
              progressStatus: progress?.status || 'not_started',
              draftCode: progress?.draftCode || '',
            };
          });
          return {
            id: assignment.id,
            title: assignment.title,
            description: assignment.description,
            groupId: assignment.groupId,
            groupName: assignment.group.name,
            startsAt: assignment.startsAt.toISOString(),
            dueAt: assignment.dueAt.toISOString(),
            status: assignment.status,
            problems: problemsWithProgress,
          };
        }
      } catch {}
    }

    const memAssignment = this.prisma.memoryStore.assignments.find((a) => a.id === assignmentId);
    if (!memAssignment) throw new NotFoundException('Vazifa topilmadi');

    const aps = this.prisma.memoryStore.assignmentProblems.filter((ap) => ap.assignmentId === assignmentId);
    const problems = aps.map((ap) => {
      const prob = this.prisma.memoryStore.problems.find((p) => p.id === ap.problemId);
      const progress = this.prisma.memoryStore.studentProgress.find(
        (sp) => sp.assignmentId === assignmentId && sp.problemId === ap.problemId && sp.studentId === studentId,
      );
      return {
        ...prob,
        progressStatus: progress?.status || 'not_started',
        draftCode: progress?.draftCode || '',
      };
    });

    return {
      id: memAssignment.id,
      title: memAssignment.title,
      description: memAssignment.description,
      groupId: memAssignment.groupId,
      groupName: 'Guruh-101 (Python & C++)',
      startsAt: memAssignment.startsAt.toISOString(),
      dueAt: memAssignment.dueAt.toISOString(),
      status: memAssignment.status,
      problems,
    };
  }

  async create(data: any, teacherId: string) {
    const { title, description, groupId, startsAt, dueAt, problemIds } = data;
    const a = {
      id: `assign-${Date.now()}`,
      title,
      description: description || '',
      groupId,
      startsAt: new Date(startsAt),
      dueAt: new Date(dueAt),
      status: 'published',
      createdBy: teacherId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.prisma.memoryStore.assignments.push(a);
    return a;
  }

  async update(id: string, data: any) {
    const a = this.prisma.memoryStore.assignments.find((item) => item.id === id);
    if (a) Object.assign(a, data);
    return a;
  }

  async startAssignment(assignmentId: string, studentId: string) {
    return { started: true };
  }
}
