import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { CurrentUser } from '../common/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('O‘qituvchi — Vazifalar')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('teacher/assignments')
export class TeacherAssignmentsController {
  constructor(private assignmentsService: AssignmentsService) {}

  @Get()
  @Roles('teacher', 'admin')
  @ApiOperation({ summary: 'Barcha vazifalar' })
  async getAll() {
    return this.assignmentsService.findAllForTeacher();
  }

  @Post()
  @Roles('teacher', 'admin')
  @ApiOperation({ summary: 'Yangi vazifa yaratish va guruhga biriktirish' })
  async create(@Body() body: any, @CurrentUser('id') teacherId: string) {
    return this.assignmentsService.create(body, teacherId);
  }

  @Patch(':id')
  @Roles('teacher', 'admin')
  @ApiOperation({ summary: 'Vazifani yangilash' })
  async update(@Param('id') id: string, @Body() body: any) {
    return this.assignmentsService.update(id, body);
  }
}

@ApiTags('O‘quvchi — Vazifalar')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('assignments')
export class StudentAssignmentsController {
  constructor(private assignmentsService: AssignmentsService) {}

  @Get()
  @ApiOperation({ summary: 'O‘quvchining vazifalari ro‘yxati' })
  async getStudentAssignments(@CurrentUser('id') studentId: string) {
    return this.assignmentsService.findAllForStudent(studentId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Vazifa tafsilotlari va masalalari' })
  async getAssignmentDetails(@Param('id') id: string, @CurrentUser('id') studentId: string) {
    return this.assignmentsService.findOneForStudent(id, studentId);
  }

  @Post(':id/start')
  @ApiOperation({ summary: 'Vazifani ishlashni boshlash' })
  async startAssignment(@Param('id') id: string, @CurrentUser('id') studentId: string) {
    return this.assignmentsService.startAssignment(id, studentId);
  }
}
