import { Column, PrimaryGeneratedColumn } from 'typeorm';

class Name {
  @Column({
    name: 'first_name',
  })
  firstName: string;

  @Column({
    name: 'last_name',
  })
  lastName: string;
}

export class StudentModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(() => Name)
  name: Name;

  @Column()
  class: string;
}

export class TeacherModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(() => Name)
  name: Name;

  @Column()
  salary: number;
}
