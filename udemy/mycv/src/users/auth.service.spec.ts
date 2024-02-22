import { AuthService } from './auth.service';
import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let mockUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // Create a fake copy of the UsersService
    // Partial을 사용하여 Mock 객체를 생성할 때 TypeScript가 각 메서드의 반환 타입을 추론할 수 있도록 한다.
    mockUsersService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
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
    const user = await authService.signUp('test@test.com', 'qwer1234');
    expect(user.password).not.toEqual('qwer1234');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    mockUsersService.find = () =>
      Promise.resolve([{ id: 1, email: 'a', password: 'b' } as User]);
    await expect(
      authService.signUp('test@test.com', 'qwer1234'),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws if signIn is called with an unused email', async () => {
    await expect(
      authService.signIn('test@test.com', 'qwer1234'),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws if an invalid password is provided', async () => {
    mockUsersService.find = () =>
      Promise.resolve([
        { email: 'test@test.com', password: 'salted_password' } as User,
      ]);
    await expect(
      authService.signIn('test@test.com', 'qwer1234'),
    ).rejects.toThrow(BadRequestException);
  });

  it('returns a user if correct password is provided', async () => {
    const email: string = 'test@test.com';
    const password: string = 'qwer1234';
    const user = await authService.signUp(email, password);
    const hashedPassword = user.password;
    mockUsersService.find = () =>
      Promise.resolve([{ email, password: hashedPassword } as User]);

    await authService.signIn('test@test. com', 'qwer1234');
    expect(user).toBeDefined();
  });
});
