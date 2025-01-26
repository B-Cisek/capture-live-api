import { HttpException, HttpStatus } from '@nestjs/common';

export class ChannelAlreadyRecordingException extends HttpException {
  constructor() {
    super('Channel already recording', HttpStatus.CONFLICT);
  }
}
