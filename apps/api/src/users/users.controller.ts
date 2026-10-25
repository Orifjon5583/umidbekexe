import { Controller, Get, Post, Patch, Param, Body, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { CurrentUser } from '../common/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UserRole } from '@codepractice/shared-types';

@ApiTags('Administrator — Foydalanuvchilar')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Barcha foydalanuvchilar ro‘yxati' })
  async getUsers(@Query('role') role?: UserRole) {
    return this.usersService.findAll(role);
  }

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Yangi foydalanuvchi yaratish' })
  async createUser(
    @Body() body: { fullName: string; username: string; password: string; role: UserRole },
    @CurrentUser('id') adminId: string,
  ) {
    return this.usersService.createUser(body, adminId);
  }

  @Post(':id/reset-password')
  @Roles('admin')
  @ApiOperation({ summary: 'Foydalanuvchi parolini qayta o‘rnatish' })
  async resetPassword(
    @Param('id') userId: string,
    @Body('newPassword') newPass: string,
    @CurrentUser('id') adminId: string,
  ) {
    return this.usersService.resetPassword(userId, newPass, adminId);
  }

  @Patch(':id/status')
  @Roles('admin')
  @ApiOperation({ summary: 'Foydalanuvchini faollashtirish/bloklash' })
  async toggleStatus(
    @Param('id') userId: string,
    @Body('isActive') isActive: boolean,
    @CurrentUser('id') adminId: string,
  ) {
    return this.usersService.updateStatus(userId, isActive, adminId);
  }
}
