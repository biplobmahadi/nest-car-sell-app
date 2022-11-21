import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUserService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeAuthService = {
      signin: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
      // signUp: () => {}
    };
    fakeUserService = {
      find: (email: string) =>
        Promise.resolve([{ id: 1, email, password: 'haha' } as User]),
      findOne: (id: number) =>
        Promise.resolve({ id, email: 'ha@ha', password: 'haha' } as User),
      // update: () => {},
      // remove: () => {}
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: AuthService, useValue: fakeAuthService },
        { provide: UsersService, useValue: fakeUserService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined ok', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers to get array of user', async () => {
    const users = await controller.findAllUsers('aa@aa.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('aa@aa.com');
  });

  it('findUserById test when one user found', async () => {
    const user = await controller.findUserById('1');
    expect(user).toBeDefined();
  });

  it('findById will throw error if no user found', async () => {
    fakeUserService.findOne = () => null;

    await expect(controller.findUserById('1')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('signIn gives a user and set session obj', async () => {
    const session: { userId?: number } = {};
    const user = await controller.signin(
      { email: 'haha', password: 'again' },
      session,
    );

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
