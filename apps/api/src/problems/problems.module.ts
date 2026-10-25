import { Module } from '@nestjs/common';
import { ProblemsService } from './problems.service';
import { TeacherProblemsController, StudentProblemsController } from './problems.controller';
import { PrismaService } from '../common/prisma.service';

@Module({
  providers: [ProblemsService, PrismaService],
  controllers: [TeacherProblemsController, StudentProblemsController],
  exports: [ProblemsService],
})
export class ProblemsModule {}
