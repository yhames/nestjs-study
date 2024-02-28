import { User } from '../../users/users.entity';
import { Exclude, Expose, Transform } from 'class-transformer';

export class ReportDto {
  @Expose()
  price: number;

  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  year: number;

  @Expose()
  lng: number;

  @Expose()
  lat: number;

  @Expose()
  mileage: number;

  @Exclude()
  user: User;

  @Expose()
  @Transform(({ obj }) => obj.user.id) // obj is original report entity
  userId: number;
}
