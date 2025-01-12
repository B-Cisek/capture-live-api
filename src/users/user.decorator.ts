import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type Payload = {
  id: string;
  email: string;
};

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Payload => {
    const request = ctx.switchToHttp().getRequest();

    return {
      id: request.user.sub,
      email: request.user.email,
    };
  },
);
