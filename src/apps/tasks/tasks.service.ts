import { User } from '@app/entities';
import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  private readonly uri =
    'https://email-service.digitalenvision.com.au/send-email';

  constructor(private schedulerRegistry: SchedulerRegistry) {}

  /**
   * A function for add birth day scheduler
   * @param name - user entity
   * @param cronExpression - a cron expression
   * @param callback - callback function after job scheduled
   */
  addBirthdayCronJob(user: User, cronExpression: string) {
    const job = new CronJob(
      `${cronExpression}`,
      async () => {
        await this.sendMessage(user);
      },
      null,
      false,
      'Asia/Jakarta',
    );

    this.schedulerRegistry.addCronJob(user.email, job);

    job.start();

    this.logger.log(
      `The task for ${user.email} has been added with the following cron expression : ${cronExpression}.`,
    );
  }

  /**
   * A function for sending a message
   * @param user - user entity
   */
  async sendMessage(user: User): Promise<boolean> {
    this.logger.log(`Sending a message...`);
    try {
      const res = await fetch(this.uri, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          message: `Hey, ${user.firstName} ${user.lastName ?? ''} it’s your birthday`,
        }),
      });

      const result = await res.json();
      this.logger.log(result);

      if (result.status === 'sent') {
        return true;
      } else {
        // re-create scheduler for failed message
        this.resendFailedMessage(user);
        return false;
      }
    } catch (error) {
      this.logger.error(error);
      // re-create scheduler for failed message
      this.resendFailedMessage(user);
      return false;
    }
  }

  /**
   * A function for re-sending failed message and delete it on completed.
   * @param user - user entity
   */
  async resendFailedMessage(user: User) {
    this.logger.log(`Re-sending failed message...`);
    const job = new CronJob(
      '0 10 * * * *',
      async () => {
        const isSent = await this.sendMessage(user);
        this.logger.log('isSent?', isSent);
        if (isSent) {
          this.schedulerRegistry.deleteCronJob(`failed_${user.email}`);
        }
      },
      null,
      false,
      'Asia/Jakarta',
    );

    this.schedulerRegistry.addCronJob(`failed_${user.email}`, job);

    job.start();

    this.logger.log(
      `The task for failed_${user.email} has been added every hour, at the start of the 10th minute.`,
    );
  }

  /**
   * A function for removing scheduler by name.
   * @param name - string
   */
  async remove(name: string) {
    this.schedulerRegistry.deleteCronJob(name);
    this.logger.log(`Task ${name} removed!`);
  }
}
