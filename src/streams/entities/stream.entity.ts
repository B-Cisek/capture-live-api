import { Column, Entity, ObjectId } from 'typeorm';
import { Platform } from './platform.entity';
import { AbstractEntity } from '../../shared/abstract.entity';

export enum StreamStatus {
  READY = 'ready',
  IN_PROGRESS = 'in_progress',
}

@Entity()
export class Stream extends AbstractEntity {
  @Column()
  channel: string;

  @Column(() => Platform)
  platform: Platform;

  @Column()
  isActive: boolean;

  @Column()
  status: StreamStatus;

  @Column()
  startAt: Date;

  @Column()
  endAt: Date;

  @Column('objectId')
  userId: ObjectId;
}
