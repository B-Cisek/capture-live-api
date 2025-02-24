import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// TODO: in the future export to a separate module

export enum PlatformName {
  TWITCH = 'twitch',
  YOUTUBE = 'youtube',
  KICK = 'kick',
}

@Entity()
export class Platform {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
    type: 'enum',
    enum: PlatformName,
  })
  name: PlatformName;

  @Column()
  url: string;

  constructor(name: PlatformName, url: string) {
    this.name = name;
    this.url = url;
  }
}
