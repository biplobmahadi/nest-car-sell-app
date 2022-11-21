import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('Auth Service', () => {
  let service: AuthService;
  let fakeUserService: Partial<UsersService>;
  beforeEach(async () => {
    // create fake user service instance
    fakeUserService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({
          id: 1,
          email,
          password,
        } as User),
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
    fakeUserService.find = () => {
      return Promise.resolve([{ id: 1, email: 'a', password: 'b' } as User]);
    };
    await expect(service.signUp('asdf@asdf.com', 'asdf')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('signin where user not registerd', async () => {
    await expect(service.signin('bb@bb.com', 'pass')).rejects.toThrow(
      BadRequestException,
    );
  });
});
