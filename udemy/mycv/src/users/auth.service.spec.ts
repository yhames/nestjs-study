import { AuthService } from './auth.service';
import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';

it('can create an instance of AuthService', async () => {
  // Create a fake copy of the UsersService
  const mockUsersService = {
    find: () => Promise.resolve([]),
    create: (email: string, password: string) =>
      Promise.resolve({ id: 1, email, password }),
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
