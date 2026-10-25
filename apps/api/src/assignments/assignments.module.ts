import { Module } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { TeacherAssignmentsController, StudentAssignmentsController } from './assignments.controller';
import { PrismaService } from '../common/prisma.service';

@Module({
  providers: [AssignmentsService, PrismaService],
  controllers: [TeacherAssignmentsController, StudentAssignmentsController],
  exports: [AssignmentsService],
})
export class AssignmentsModule {}
