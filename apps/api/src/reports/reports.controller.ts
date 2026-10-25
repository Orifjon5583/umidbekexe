import { Controller, Get, Param, Query, Res, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('O‘qituvchi — Hisobotlar va Natijalar')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('teacher')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('dashboard')
  @Roles('teacher', 'admin')
  @ApiOperation({ summary: 'O‘qituvchi umumiy statistikasi' })
  async getDashboard() {
    return this.reportsService.getTeacherDashboard();
  }

  @Get('groups/:id/progress')
  @Roles('teacher', 'admin')
  @ApiOperation({ summary: 'Guruh bo‘yicha o‘quvchilar progressi' })
  async getGroupProgress(@Param('id') groupId: string) {
    return this.reportsService.getGroupProgress(groupId);
  }

  @Get('students/:id/progress')
  @Roles('teacher', 'admin')
  @ApiOperation({ summary: 'O‘quvchi bo‘yicha batafsil natijalar' })
  async getStudentProgress(@Param('id') studentId: string) {
    return this.reportsService.getStudentProgressReport(studentId);
  }

  @Get('reports/export')
  @Roles('teacher', 'admin')
  @ApiOperation({ summary: 'Natijalarni CSV formatida eksport qilish' })
  async exportCsv(@Query('groupId') groupId: string, @Res() res: Response) {
    const csvData = await this.reportsService.exportCsv(groupId);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=codepractice_results.csv');
    return res.send(csvData);
  }
}
