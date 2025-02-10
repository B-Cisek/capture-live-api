export class UserSignUpEvent {
  constructor(public readonly id: string) {}
}

export const UserSignUpEventName = 'user.signUp';
