import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AIService } from './ai.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AIRequestDto } from '@codepractice/shared-types';

@ApiTags('O‘quvchi — AI Yordamchi')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AIController {
  constructor(private aiService: AIService) {}

  @Post('explain-problem')
  @ApiOperation({ summary: 'Masala shartini sodda tilda tushuntirish' })
  async explainProblem(@Body() body: AIRequestDto, @CurrentUser('id') studentId: string) {
    return this.aiService.handleAIRequest(studentId, { ...body, requestType: 'explain_problem' });
  }

  @Post('explain-code')
  @ApiOperation({ summary: 'Koddagi muammo va xatoliklarni tushuntirish' })
  async explainCode(@Body() body: AIRequestDto, @CurrentUser('id') studentId: string) {
    return this.aiService.handleAIRequest(studentId, { ...body, requestType: 'explain_code' });
  }

  @Post('explain-error')
  @ApiOperation({ summary: 'Kompilyatsiya yoki bajarilish xatosini tushuntirish' })
  async explainError(@Body() body: AIRequestDto, @CurrentUser('id') studentId: string) {
    return this.aiService.handleAIRequest(studentId, { ...body, requestType: 'explain_error' });
  }

  @Post('hint')
  @ApiOperation({ summary: 'Keyingi qadam uchun yo‘naltiruvchi maslahat' })
  async hint(@Body() body: AIRequestDto, @CurrentUser('id') studentId: string) {
    return this.aiService.handleAIRequest(studentId, { ...body, requestType: 'hint' });
  }

  @Post('explain-test')
  @ApiOperation({ summary: 'Test natijalari va muammolarni izohlash' })
  async explainTest(@Body() body: AIRequestDto, @CurrentUser('id') studentId: string) {
    return this.aiService.handleAIRequest(studentId, { ...body, requestType: 'explain_test' });
  }
}
