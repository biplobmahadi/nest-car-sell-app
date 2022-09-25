import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  Patch,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {
  constructor(private user: UsersService) {}

  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    this.user.create(body.email, body.password);
  }

  @Get('/users')
  findAllUsers(@Query('email') email: string) {
    return this.user.find(email);
  }

  @Get('/user/:id')
  async findUserById(@Param('id') id: string) {
    const user = await this.user.findOne(parseInt(id));

    if (!user) throw new NotFoundException('User not found man!');

    return user;
  }

  @Patch('/user/update/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.user.update(parseInt(id), body);
  }

  @Delete('/user/delete/:id')
  deleteUser(@Param('id') id: string) {
    return this.user.remove(parseInt(id));
  }
}
