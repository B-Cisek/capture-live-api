import { Entity, Column, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../shared/abstract.entity';
import { Channel } from '../../channel/entities/channel.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User extends AbstractEntity {
  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @OneToMany(() => Channel, (channel) => channel.user)
  channels: Channel[];
}
