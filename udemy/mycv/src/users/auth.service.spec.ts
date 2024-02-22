import { AuthService } from './auth.service';
import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './users.entity';

it('can create an instance of AuthService', async () => {
  // Create a fake copy of the UsersService
  // Partial을 사용하여 Mock 객체를 생성할 때 TypeScript가 각 메서드의 반환 타입을 추론할 수 있도록 한다.
  const mockUsersService: Partial<UsersService> = {
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

  const authService = module.get(AuthService);
  expect(authService).toBeDefined();
});
