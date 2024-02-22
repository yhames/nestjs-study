import { AuthService } from './auth.service';
import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let mockUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    // Create a fake copy of the UsersService
    // Partial을 사용하여 Mock 객체를 생성할 때 TypeScript가 각 메서드의 반환 타입을 추론할 수 있도록 한다.
    mockUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 99999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(users[users.length - 1]);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    authService = module.get(AuthService);
  });

  it('can create an instance of AuthService', async () => {
    expect(authService).toBeDefined();
  });

  it('creates a new user with a salted and hased password', async () => {
    // given
    const email: string = 'test@test.com';
    const password: string = 'qwer1234';

    // when
    const user = await authService.signUp(email, password);
    const [salt, hash] = user.password.split('.');

    // then
    expect(user.password).not.toEqual(password);
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    // given
    const email: string = 'test@test.com';
    const password: string = 'qwer1234';
    await authService.signUp(email, password);

    // expected
    await expect(authService.signUp(email, password)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws if signIn is called with an unused email', async () => {
    // given
    const email: string = 'test@test.com';
    const password: string = 'qwer1234';

    // expected
    await expect(authService.signIn(email, password)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws if an invalid password is provided', async () => {
    // given
    const email: string = 'test@test.com';
    const password: string = 'qwer1234';
    await authService.signUp(email, password);

    // expected
    await expect(authService.signIn(email, 'InvalidPassword')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('returns a user if correct password is provided', async () => {
    // given
    const email: string = 'test@test.com';
    const password: string = 'qwer1234';
    await authService.signUp(email, password);

    // expected
    const user = await authService.signIn(email, password);
    expect(user).toBeDefined();
  });
});
