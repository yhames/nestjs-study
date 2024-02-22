import { AuthService } from './auth.service';
import { Test } from '@nestjs/testing';

it('can create an instance of AuthService', async () => {
  const module = await Test.createTestingModule({
    providers: [AuthService],
  }).compile();

  const authService = module.get(AuthService);
  expect(authService).toBeDefined();
});
