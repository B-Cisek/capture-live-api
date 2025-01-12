import {
  CreateDateColumn,
  ObjectId,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class AbstractEntity {
  @ObjectIdColumn()
  public _id: ObjectId;

  @UpdateDateColumn()
  public updatedAt: Date;

  @CreateDateColumn()
  public createdAt: Date;
}
