import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto'; // randomBytes: salt, scrypt: hash
import { promisify } from 'util'; // promisify: callback to promise for scrypt

const scrypt = promisify(_scrypt); // scrypt 함수를 Promise로 변환한다.

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signUp(email: string, password: string) {
    // See if email is in use
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('Email in use');
    }

    // Hash the user's password
    // 1. Generate a salt
    // 2. Hash the salt and the password together
    // 3. Join the hashed result and the salt together
    const salt = randomBytes(8).toString('hex'); // 8바이트 길이의 salt를 생성한다.
    const hash = (await scrypt(password, salt, 32)) as Buffer; // 32바이트 길이의 해시값을 생성한다.
    const result = salt + '.' + hash.toString('hex'); // salt와 해시값을 합친다. (salt는 해시값을 decode할 때 사용된다.)

    // Create a new user and return it
    return this.usersService.create(email, result);
  }

  async signIn(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Bad password');
    }

    return user;
  }
}
