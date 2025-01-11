import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '@app/prisma.service';
import { TasksService } from '../tasks/tasks.service';

@Module({
  controllers: [UserController],
  providers: [PrismaService, TasksService, UserService],
  exports: [PrismaService, TasksService],
})
export class UserModule {}
