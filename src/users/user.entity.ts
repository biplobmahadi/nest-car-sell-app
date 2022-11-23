import { Report } from '../reports/report.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  admin: boolean;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

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
