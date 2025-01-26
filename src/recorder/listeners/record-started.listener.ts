import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { RecordStartedEvent } from '../events/record-started.event';

@Injectable()
export class RecordStartedListener {
  @OnEvent('record.started')
  handleOrderCreatedEvent(event: RecordStartedEvent) {
    console.log('record.started');
    console.log(event);
  }
}
