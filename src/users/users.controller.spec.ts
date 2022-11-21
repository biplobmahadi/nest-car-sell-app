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
      // signin: () => {},
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
});
