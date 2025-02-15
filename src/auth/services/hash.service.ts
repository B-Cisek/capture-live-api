import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';

@Injectable()
export class HashService {
  async hash(password: string): Promise<string> {
    // const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, 10);
  }

  async equals(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  determineHash(text: string, algorithm: string = 'sha256'): string {
    return createHash(algorithm).update(text).digest('hex');
  }
}
