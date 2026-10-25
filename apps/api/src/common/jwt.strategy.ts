import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from './prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET || 'codepractice_super_secret_jwt_access_key_2026_xyz',
    });
  }

  async validate(payload: any) {
    let user: any = null;
    if (this.prisma.isConnected) {
      try {
        user = await this.prisma.user.findUnique({
          where: { id: payload.sub },
          select: {
            id: true,
            fullName: true,
            username: true,
            role: true,
            isActive: true,
          },
        });
      } catch {}
    }

    if (!user) {
      const memUser = this.prisma.memoryStore.users.find((u) => u.id === payload.sub);
      if (memUser) {
        user = {
          id: memUser.id,
          fullName: memUser.fullName,
          username: memUser.username,
          role: memUser.role,
          isActive: memUser.isActive,
        };
      }
    }

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Foydalanuvchi hisobi faol emas yoki topilmadi');
    }

    return user;
  }
}
