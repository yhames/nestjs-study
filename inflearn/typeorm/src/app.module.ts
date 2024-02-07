import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './entity/user.entity';
import { StudentModel, TeacherModel } from './entity/person.entity';
import {
  BookModel,
  CarModel,
  ComputerModel,
  PhoneModel,
  SingleBaseModel,
} from './entity/inheritance.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserModel]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'typeormstudy',
      entities: [
        UserModel,
        TeacherModel,
        StudentModel,
        BookModel,
        CarModel,
        SingleBaseModel,
        ComputerModel,
        PhoneModel,
      ],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
