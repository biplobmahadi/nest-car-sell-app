import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signUp(email: string, password: string) {
    // check email already used or not
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new NotFoundException('Email already exist!');
    }

    // hash pass with salt
    const salt = randomBytes(8).toString('hex'); // 8 byte er buffer and 1 byte will give 2 char in hex

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    const hashedPassWithSalt = salt + '.' + hash.toString('hex');

    // create user with hashed pass and email
    const user = this.usersService.create(email, hashedPassWithSalt);

    // return user
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) throw new BadRequestException('nai');

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex'))
      throw new NotFoundException('millo na');
    return user;
  }
}
