import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Platform } from '../../channels/entities/platform.entity';

@Entity()
export class RecordingProcess {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  channelName: string;

  @OneToOne(() => Platform)
  @JoinColumn()
  platform: Platform;

  @Column()
  pid: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
