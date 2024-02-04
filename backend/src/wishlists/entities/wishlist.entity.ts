import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
} from 'typeorm';
import { IsUrl, Length } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: Date, default: '2023-12-30T16:00:16.633Z' })
  createdAt: Date;

  @UpdateDateColumn({ type: Date, default: '2023-12-30T16:00:16.633Z' })
  updatedAt: Date;

  @Column({ type: 'varchar', unique: true, length: 250, nullable: false })
  @Length(1, 250)
  name: string;

  @Column({ default: '', nullable: false })
  @Length(1, 1500)
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;
}
