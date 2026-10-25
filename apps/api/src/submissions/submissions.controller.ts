import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('O‘quvchi — Urinishlar (Submissions)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class SubmissionsController {
  constructor(private submissionsService: SubmissionsService) {}

  @Post('problems/:id/submissions')
  @ApiOperation({ summary: 'Kod tekshirish natijasini saqlash' })
  async createSubmission(
    @Param('id') problemId: string,
    @Body() body: any,
    @CurrentUser('id') studentId: string,
  ) {
    return this.submissionsService.createSubmission(studentId, problemId, body);
  }

  @Get('submissions/:id')
  @ApiOperation({ summary: 'Urinish tafsilotlarini ko‘rish' })
  async getSubmission(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: string,
  ) {
    return this.submissionsService.findOne(id, userId, role);
  }
}
