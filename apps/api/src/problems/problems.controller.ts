import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ProblemsService } from './problems.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { CurrentUser } from '../common/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('O‘qituvchi — Masalalar')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('teacher/problems')
export class TeacherProblemsController {
  constructor(private problemsService: ProblemsService) {}

  @Get()
  @Roles('teacher', 'admin')
  @ApiOperation({ summary: 'Barcha masalalar ro‘yxati' })
  async getAll() {
    return this.problemsService.findAll(true);
  }

  @Post()
  @Roles('teacher', 'admin')
  @ApiOperation({ summary: 'Yangi masala yaratish' })
  async create(@Body() body: any, @CurrentUser('id') teacherId: string) {
    return this.problemsService.create(body, teacherId);
  }

  @Get(':id')
  @Roles('teacher', 'admin')
  @ApiOperation({ summary: 'Masala tafsilotlari va barcha testlari' })
  async getOne(@Param('id') id: string) {
    return this.problemsService.findOneForTeacher(id);
  }

  @Patch(':id')
  @Roles('teacher', 'admin')
  @ApiOperation({ summary: 'Masalani tahrirlash' })
  async update(@Param('id') id: string, @Body() body: any) {
    return this.problemsService.update(id, body);
  }

  @Post(':id/tests')
  @Roles('teacher', 'admin')
  @ApiOperation({ summary: 'Masalaga test qo‘shish' })
  async addTest(@Param('id') problemId: string, @Body() body: any) {
    return this.problemsService.addTestCase(problemId, body);
  }

  @Delete(':id/tests/:testId')
  @Roles('teacher', 'admin')
  @ApiOperation({ summary: 'Testni o‘chirish' })
  async deleteTest(@Param('testId') testId: string) {
    return this.problemsService.deleteTestCase(testId);
  }
}

@ApiTags('O‘quvchi — Masalalar')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('problems')
export class StudentProblemsController {
  constructor(private problemsService: ProblemsService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Masala sharti va namunaviy testlar' })
  async getProblem(@Param('id') id: string) {
    return this.problemsService.findOneForStudent(id);
  }
}
