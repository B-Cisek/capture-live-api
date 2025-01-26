import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectId,
  ObjectIdColumn,
} from 'typeorm';
import { Provider } from '../services/recorder/enums/provider';

@Entity()
export class RecordingProcess {
  @ObjectIdColumn()
  public _id: ObjectId;

  @Column()
  public channelName: string;

  @Column()
  public provider: Provider;

  @Column()
  public pid: number;

  @Column()
  @CreateDateColumn()
  public createdAt: Date;
}
