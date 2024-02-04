import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsBoolean } from 'class-validator';
import { Wish } from '../../wishes/entities/wish.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: Date, default: '2023-12-30T16:00:16.633Z' })
  createdAt: Date;

  @UpdateDateColumn({ type: Date, default: '2023-12-30T16:00:16.633Z' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.username)
  user: User; //содержит id желающего скинуться

  @ManyToOne(() => Wish, (wish) => wish.link)
  item: Wish; //ссылка на товар

  @Column({ scale: 2, type: 'numeric' })
  amount: number;

  @Column({ type: 'boolean', default: false })
  @IsBoolean()
  hidden: boolean;
}
