import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const groups = await this.prisma.group.findMany({
      include: {
        _count: {
          select: {
            members: true,
            assignments: { where: { status: 'published' } },
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return groups.map((g) => ({
      id: g.id,
      name: g.name,
      studentCount: g._count.members,
      activeAssignmentsCount: g._count.assignments,
      createdAt: g.createdAt.toISOString(),
      updatedAt: g.updatedAt.toISOString(),
    }));
  }

  async findOne(id: string) {
    const group = await this.prisma.group.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            student: {
              select: {
                id: true,
                fullName: true,
                username: true,
                role: true,
                isActive: true,
                createdAt: true,
              },
            },
          },
        },
        assignments: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!group) throw new NotFoundException('Guruh topilmadi');

    return {
      id: group.id,
      name: group.name,
      studentCount: group.members.length,
      createdAt: group.createdAt.toISOString(),
      updatedAt: group.updatedAt.toISOString(),
      members: group.members.map((m) => ({
        student: m.student,
        joinedAt: m.joinedAt.toISOString(),
      })),
      assignments: group.assignments,
    };
  }

  async create(name: string, teacherId?: string) {
    const cleanName = name.trim();
    const existing = await this.prisma.group.findUnique({ where: { name: cleanName } });
    if (existing) {
      throw new BadRequestException('Bunday nomli guruh allaqachon mavjud');
    }

    const group = await this.prisma.group.create({
      data: { name: cleanName },
    });

    if (teacherId) {
      await this.prisma.auditLog.create({
        data: {
          actorId: teacherId,
          action: 'CREATE_GROUP',
          entityType: 'Group',
          entityId: group.id,
        },
      }).catch(() => {});
    }

    return group;
  }

  async update(id: string, name: string) {
    return this.prisma.group.update({
      where: { id },
      data: { name: name.trim() },
    });
  }

  async addStudent(groupId: string, studentId: string) {
    const group = await this.prisma.group.findUnique({ where: { id: groupId } });
    if (!group) throw new NotFoundException('Guruh topilmadi');

    const student = await this.prisma.user.findUnique({ where: { id: studentId } });
    if (!student || student.role !== 'student') {
      throw new BadRequestException('Ko‘rsatilgan foydalanuvchi o‘quvchi emas yoki topilmadi');
    }

    return this.prisma.groupMember.upsert({
      where: {
        groupId_studentId: { groupId, studentId },
      },
      create: { groupId, studentId },
      update: {},
    });
  }

  async removeStudent(groupId: string, studentId: string) {
    return this.prisma.groupMember.deleteMany({
      where: { groupId, studentId },
    });
  }
}
