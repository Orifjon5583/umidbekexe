import { Controller, Get, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('O‘quvchi — Progress va Autosave')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class ProgressController {
  constructor(private progressService: ProgressService) {}

  @Get('students/me/dashboard')
  @ApiOperation({ summary: 'O‘quvchining asosiy dashboardi' })
  async getDashboard(@CurrentUser('id') studentId: string) {
    return this.progressService.getStudentDashboard(studentId);
  }

  @Get('assignments/:id/progress')
  @ApiOperation({ summary: 'Masala bo‘yicha saqlangan qoralama kodni olish' })
  async getProgress(
    @Param('id') assignmentId: string,
    @Query('problemId') problemId: string,
    @CurrentUser('id') studentId: string,
  ) {
    return this.progressService.getProgress(assignmentId, problemId, studentId);
  }

  @Put('assignments/:id/progress')
  @ApiOperation({ summary: 'Kodni avtomatik saqlash (Autosave)' })
  async saveProgress(
    @Param('id') assignmentId: string,
    @Body() body: any,
    @CurrentUser('id') studentId: string,
  ) {
    return this.progressService.saveProgress({
      assignmentId,
      problemId: body.problemId,
      studentId,
      draftCode: body.draftCode,
      language: body.language,
      status: body.status,
    });
  }
}
