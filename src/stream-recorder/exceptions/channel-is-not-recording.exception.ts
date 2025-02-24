import { HttpException, HttpStatus } from '@nestjs/common';

export class ChannelIsNotRecordingException extends HttpException {
  constructor() {
    super('Channel is not recording', HttpStatus.CONFLICT);
  }
}
