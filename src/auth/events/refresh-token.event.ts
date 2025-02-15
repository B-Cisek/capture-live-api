export class RefreshTokenEvent {
  constructor(public readonly id: string) {}
}

export const RefreshTokenEventName = 'user.refresh.token';
