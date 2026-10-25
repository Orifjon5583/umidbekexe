import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { CurrentUser } from '../common/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('O‘qituvchi — Guruhlar')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('teacher/groups')
export class GroupsController {
  constructor(private groupsService: GroupsService) {}

  @Get()
  @Roles('teacher', 'admin')
  @ApiOperation({ summary: 'Guruhlar ro‘yxati' })
  async getGroups() {
    return this.groupsService.findAll();
  }

  @Post()
  @Roles('teacher', 'admin')
  @ApiOperation({ summary: 'Yangi guruh yaratish' })
  async createGroup(@Body('name') name: string, @CurrentUser('id') teacherId: string) {
    return this.groupsService.create(name, teacherId);
  }

  @Get(':id')
  @Roles('teacher', 'admin')
  @ApiOperation({ summary: 'Guruh ma’lumotlari va a’zolari' })
  async getGroup(@Param('id') id: string) {
    return this.groupsService.findOne(id);
  }

  @Patch(':id')
  @Roles('teacher', 'admin')
  @ApiOperation({ summary: 'Guruh nomini o‘zgartirish' })
  async updateGroup(@Param('id') id: string, @Body('name') name: string) {
    return this.groupsService.update(id, name);
  }

  @Post(':id/students')
  @Roles('teacher', 'admin')
  @ApiOperation({ summary: 'O‘quvchini guruhga biriktirish' })
  async addStudent(@Param('id') groupId: string, @Body('studentId') studentId: string) {
    return this.groupsService.addStudent(groupId, studentId);
  }

  @Delete(':id/students/:studentId')
  @Roles('teacher', 'admin')
  @ApiOperation({ summary: 'O‘quvchini guruhdan chiqarish' })
  async removeStudent(@Param('id') groupId: string, @Param('studentId') studentId: string) {
    return this.groupsService.removeStudent(groupId, studentId);
  }
}
