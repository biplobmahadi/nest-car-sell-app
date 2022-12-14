import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('Auth Service', () => {
  let service: AuthService;

  beforeEach(async () => {
    // create fake user service instance
    const users: User[] = [];
    const fakeUserService: Partial<UsersService> = {
      find: (email) => {
        const filterdUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filterdUsers);
      },
      create: (email: string, password: string) => {
        const user = { id: Math.floor(Math.random() * 999), email, password };
        users.push(user as User);
        return Promise.resolve(user as User);
      },
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a user using signup', async () => {
    const user = await service.signUp('bip@bip.com', 'bip');

    expect(user.password).not.toEqual('bip');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
    expect(user.email).toEqual('bip@bip.com');
  });

  it('sign up throw error if user already available', async () => {
    await service.signUp('asdf@asdf.com', 'asdf');
    await expect(service.signUp('asdf@asdf.com', 'asdf')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('signin where user not registerd', async () => {
    await expect(service.signin('bb@bb.com', 'pass')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('signin with invalid pass', async () => {
    await service.signUp('b', 'asdf');
    await expect(service.signin('b', 'bb')).rejects.toThrow(NotFoundException);
  });

  it('valid pass', async () => {
    await service.signUp('b', 'mypass');
    const user = await service.signin('b', 'mypass');
    expect(user).toBeDefined();
  });
});
