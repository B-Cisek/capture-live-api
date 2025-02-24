import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Platform } from './platform.entity';
import { AbstractEntity } from '../../shared/abstract.entity';
import { User } from '../../user/entities/user.entity';

export enum StreamStatus {
  READY = 'ready',
  IN_PROGRESS = 'in_progress',
}

@Entity()
export class Channel extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: StreamStatus,
  })
  status: StreamStatus;

  @Column({ nullable: true })
  startAt: Date;

  @Column({ nullable: true })
  endAt: Date;

  @ManyToOne(() => Platform)
  @JoinColumn()
  platform: Platform;

  @ManyToOne(() => User, (user) => user.channels)
  user: User;
}
