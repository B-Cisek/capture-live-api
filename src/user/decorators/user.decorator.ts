import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type CurrentUserType = {
  id: string;
  email: string;
};

export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext): CurrentUserType => {
  const request = ctx.switchToHttp().getRequest();

  return {
    id: request.user.id,
    email: request.user.email,
  };
});
