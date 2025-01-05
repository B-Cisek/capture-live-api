import * as process from 'node:process';

export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'secret',
  expire: process.env.JWT_EXPIRE || '1h',
};
