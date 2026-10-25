import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../common/prisma.service';
import * as bcrypt from 'bcryptjs';
import { AuthResponse, UserRole } from '@codepractice/shared-types';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private async findUserByUsername(username: string) {
    const cleanUsername = username.toLowerCase().trim();
    if (this.prisma.isConnected) {
      try {
        const u = await this.prisma.user.findUnique({ where: { username: cleanUsername } });
        if (u) return u;
      } catch {}
    }
    return this.prisma.memoryStore.users.find((u) => u.username === cleanUsername) || null;
  }

  async login(loginDto: { username: string; password: string; rememberMe?: boolean }): Promise<AuthResponse> {
    const user = await this.findUserByUsername(loginDto.username);

    if (!user) {
      throw new UnauthorizedException('Login yoki parol noto‘g‘ri kiritildi');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Hisobingiz administrator tomonidan bloklangan');
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Login yoki parol noto‘g‘ri kiritildi');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET || 'codepractice_super_secret_jwt_access_key_2026_xyz',
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      {
        secret: process.env.JWT_REFRESH_SECRET || 'codepractice_super_secret_jwt_refresh_key_2026_xyz',
        expiresIn: loginDto.rememberMe ? '30d' : '7d',
      },
    );

    const refreshTokenHash = await bcrypt.hash(refreshToken, 8);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (loginDto.rememberMe ? 30 : 7));

    if (this.prisma.isConnected) {
      await this.prisma.session.create({
        data: {
          userId: user.id,
          refreshTokenHash,
          expiresAt,
        },
      }).catch(() => {});
    }

    return {
      user: {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        role: user.role as UserRole,
        isActive: user.isActive,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: 15 * 60,
      },
    };
  }

  async refreshTokens(refreshToken: string): Promise<{ tokens: { accessToken: string; refreshToken?: string } }> {
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'codepractice_super_secret_jwt_refresh_key_2026_xyz',
      });

      let user: any = null;
      if (this.prisma.isConnected) {
        try {
          user = await this.prisma.user.findUnique({ where: { id: decoded.sub } });
        } catch {}
      }
      if (!user) {
        user = this.prisma.memoryStore.users.find((u) => u.id === decoded.sub);
      }

      if (!user || !user.isActive) {
        throw new UnauthorizedException('Foydalanuvchi topilmadi yoki nofaol');
      }

      const newAccessToken = this.jwtService.sign(
        {
          sub: user.id,
          username: user.username,
          role: user.role,
        },
        {
          secret: process.env.JWT_ACCESS_SECRET || 'codepractice_super_secret_jwt_access_key_2026_xyz',
          expiresIn: '15m',
        },
      );

      return {
        tokens: {
          accessToken: newAccessToken,
        },
      };
    } catch {
      throw new UnauthorizedException('Refresh token yaroqsiz yoki muddati o‘tgan');
    }
  }

  async logout(userId: string, refreshToken?: string): Promise<void> {
    if (this.prisma.isConnected && userId) {
      await this.prisma.session.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }).catch(() => {});
    }
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
