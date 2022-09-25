import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @AfterInsert()
  afterInsert() {
    console.log('Created: ', this.id);
  }

  @AfterUpdate()
  afterUpdate() {
    console.log('Updated: ', this.id);
  }

  @AfterRemove()
  afterRemove() {
    console.log('Removed: ', this.id);
  }
}
