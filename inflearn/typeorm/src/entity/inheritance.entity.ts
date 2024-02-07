import {
  ChildEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  TableInheritance,
  UpdateDateColumn,
} from 'typeorm';

export class BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity()
export class BookModel extends BaseModel {
  @Column()
  title: string;
}

export class CarModel extends BaseModel {
  @Column()
  brand: string;
}

/**
 * Single Table Inheritance
 * - single_base_model
 *   - id
 *   - createdAt
 *   - updatedAt
 *   - name
 *   - brand
 *   - type <- discriminator column!!
 */
@Entity()
@TableInheritance({
  column: {
    name: 'type',
    type: 'varchar',
  },
})
export class SingleBaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@ChildEntity()
export class ComputerModel extends SingleBaseModel {
  @Column()
  name: string;
}

@ChildEntity()
export class PhoneModel extends SingleBaseModel {
  @Column()
  brand: string;
}
