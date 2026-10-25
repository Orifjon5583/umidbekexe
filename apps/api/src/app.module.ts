import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { GroupsModule } from './groups/groups.module';
import { ProblemsModule } from './problems/problems.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { ProgressModule } from './progress/progress.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { AIModule } from './ai/ai.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    GroupsModule,
    ProblemsModule,
    AssignmentsModule,
    ProgressModule,
    SubmissionsModule,
    AIModule,
    ReportsModule,
  ],
})
export class AppModule {}
