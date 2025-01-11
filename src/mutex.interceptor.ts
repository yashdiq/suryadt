import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Mutex } from 'async-mutex';

@Injectable()
export class MutexInterceptor implements NestInterceptor {
  private readonly mutex = new Mutex();

  async intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    // Wait for the mutex to be available
    const release = await this.mutex.acquire();

    try {
      // Proceed with the request
      return next.handle();
    } finally {
      // Release the lock after request completes
      release();
    }
  }
}
