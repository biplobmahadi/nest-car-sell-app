import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {
  constructor(private user: UsersService) {}

  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    this.user.create(body.email, body.password);
  }
}
