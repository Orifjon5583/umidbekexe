import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import * as bcrypt from 'bcryptjs';
import { UserRole } from '@codepractice/shared-types';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(role?: UserRole) {
    return this.prisma.user.findMany({
      where: role ? { role } : undefined,
      select: {
        id: true,
        fullName: true,
        username: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        username: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');
    return user;
  }

  async createUser(data: { fullName: string; username: string; password: string; role: UserRole }, actorId?: string) {
    const existing = await this.prisma.user.findUnique({
      where: { username: data.username.toLowerCase().trim() },
    });
    if (existing) {
      throw new BadRequestException('Bu nomdagi foydalanuvchi allaqachon mavjud');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        fullName: data.fullName.trim(),
        username: data.username.toLowerCase().trim(),
        passwordHash,
        role: data.role,
        isActive: true,
      },
      select: {
        id: true,
        fullName: true,
        username: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (actorId) {
      await this.prisma.auditLog.create({
        data: {
          actorId,
          action: 'CREATE_USER',
          entityType: 'User',
          entityId: user.id,
        },
      }).catch(() => {});
    }

    return user;
  }

  async resetPassword(userId: string, newPass: string, actorId?: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');

    const passwordHash = await bcrypt.hash(newPass, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    // Revoke all sessions for this user
    await this.prisma.session.updateMany({
      where: { userId },
      data: { revokedAt: new Date() },
    });

    if (actorId) {
      await this.prisma.auditLog.create({
        data: {
          actorId,
          action: 'RESET_PASSWORD',
          entityType: 'User',
          entityId: userId,
        },
      }).catch(() => {});
    }

    return { message: 'Parol muvaffaqiyatli yangilandi' };
  }

  async updateStatus(userId: string, isActive: boolean, actorId?: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { isActive },
      select: {
        id: true,
        fullName: true,
        username: true,
        role: true,
        isActive: true,
      },
    });

    if (!isActive) {
      await this.prisma.session.updateMany({
        where: { userId },
        data: { revokedAt: new Date() },
      });
    }

    if (actorId) {
      await this.prisma.auditLog.create({
        data: {
          actorId,
          action: isActive ? 'ENABLE_USER' : 'DISABLE_USER',
          entityType: 'User',
          entityId: userId,
        },
      }).catch(() => {});
    }

    return user;
  }
}
