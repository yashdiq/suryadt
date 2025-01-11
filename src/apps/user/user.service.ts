import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@app/prisma.service';
import { CreateUserDto, UpdateUserDto } from '@app/entities';

import { TasksService } from '../tasks/tasks.service';
import { getSchedulerExp } from '@app/utils';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private prisma: PrismaService,
    private tasksService: TasksService,
  ) {}

  async create(data: CreateUserDto) {
    try {
      const schedulerExpression = getSchedulerExp(
        data.birthdayAt,
        data.timezone,
      );

      // add scheduler
      this.tasksService.addBirthdayCronJob(data, schedulerExpression);

      data.publishMessageExp = schedulerExpression;

      const result = await this.prisma.user.create({
        data,
      });

      return result;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        'Internal server error.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOne(id: number) {
    return await this.prisma.user.findFirst({
      where: {
        id,
      },
    });
  }

  async update(id: number, data: UpdateUserDto) {
    try {
      // check old user
      const user = await this.getOne(id);

      if (!user) {
        throw new HttpException('No user found.', HttpStatus.NOT_FOUND);
      }

      if (data.birthdayAt) {
        // Remove scheduler and re-create
        await this.tasksService.remove(user.email ?? data.email);

        const schedulerExpression = getSchedulerExp(
          data.birthdayAt,
          data.timezone,
        );

        // add scheduler
        user.email = data.email ?? user.email;
        this.tasksService.addBirthdayCronJob(user, schedulerExpression);

        data.publishMessageExp = schedulerExpression;
      }

      const result = await this.prisma.user.update({
        where: {
          id,
        },
        data,
      });

      return result;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        'Internal server error.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number) {
    const user = await this.getOne(id);
    await this.tasksService.remove(user.email);
    return await this.prisma.user.delete({ where: { id } });
  }
}
