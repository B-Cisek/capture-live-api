export class UserLoginEvent {
  constructor(public readonly id: string) {}
}

export const UserLoginEventName = 'user.login';
