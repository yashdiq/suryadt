import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from './apps/user/user.module';
import { TasksModule } from './apps/tasks/tasks.module';

@Module({
  imports: [UserModule, TasksModule, ScheduleModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
