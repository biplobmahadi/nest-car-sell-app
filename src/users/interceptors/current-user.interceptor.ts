import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private user: UsersService) {}
  async intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
    const { userId } = req.session || {};

    if (userId) {
      const user = await this.user.findOne(userId);
      req.currentUser = user;
      console.log('hoilam', user);
    }

    return next.handle();
  }
}
