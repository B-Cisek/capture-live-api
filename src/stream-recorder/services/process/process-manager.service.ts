import { ChildProcess, spawn } from 'child_process';
import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'events';

export interface ProcessEvents {
  onStart?: () => void;
  onExit?: (code: number | null) => void;
  onError?: (err: Error) => void;
  onData?: (data: string) => void;
}

@Injectable()
export class ProcessManager extends EventEmitter {
  private process: ChildProcess | null = null;

  async spawn(command: string, args: string[], events?: ProcessEvents): Promise<number> {
    if (this.process) {
      throw new Error('Process is already running');
    }

    this.process = spawn(command, args);

    if (!this.process.pid) {
      throw new Error('Failed to start process');
    }

    this.setupEventListeners(events);

    return this.process.pid;
  }

  async terminate(signal?: NodeJS.Signals): Promise<void> {
    if (!this.process) {
      return;
    }

    return new Promise((resolve) => {
      this.process?.on('exit', () => {
        this.process = null;
        resolve();
      });

      this.process?.kill(signal || 'SIGTERM');
    });
  }

  async stop(): Promise<void> {
    return this.terminate('SIGTERM');
  }

  async kill(): Promise<void> {
    return this.terminate('SIGKILL');
  }

  isRunning(): boolean {
    return this.process !== null;
  }

  private setupEventListeners(events?: ProcessEvents): void {
    if (!this.process) {
      return;
    }

    this.process.on('spawn', () => {
      events?.onStart?.();
      this.emit('start');
    });

    this.process.on('exit', (code) => {
      events?.onExit?.(code);
      this.emit('exit', code);
      this.process = null;
    });

    this.process.on('error', (err) => {
      events?.onError?.(err);
      this.emit('error', err);
    });

    this.process.stdout?.on('data', (data) => {
      const output = data.toString();
      events?.onData?.(output);
      this.emit('data', output);
    });

    this.process.stderr?.on('data', (data) => {
      const output = data.toString();
      events?.onData?.(output);
      this.emit('data', output);
    });
  }
}
