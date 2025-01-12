import { Column } from 'typeorm';
import { AbstractEntity } from '../../shared/abstract.entity';

export class Platform extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  url: string;

  constructor(name: string, url: string) {
    super();
    this.name = name;
    this.url = url;
  }
}
