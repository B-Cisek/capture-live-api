import { ChildProcess, spawn } from 'child_process';

type EventCallback = (data: any) => void;

type EventMap = {
  close: EventCallback[];
  error: EventCallback[];
};

export class Process {
  private _command: string;
  private _args: string[];
  private _process: ChildProcess | null = null;
  private _events: EventMap;

  constructor() {
    this._events = {
      close: [],
      error: [],
    };
  }

  public spawn(): number {
    this._process = spawn(this._command, this._args);

    if (!this._process.pid) {
      throw new Error('Failed to spawn process');
    }

    this._process.on('close', (code) => {
      this.emit('close', code);
    });

    this._process.on('error', (err) => {
      this.emit('error', err);
    });

    return this._process.pid;
  }

  public stop(signal?: NodeJS.Signals | number): void {
    if (this._process) {
      this._process.kill(signal ?? 'SIGTERM');
      console.log(`Process for ${this._command} stopped.`);
    }
  }

  public on(event: keyof EventMap, callback: EventCallback): void {
    if (this._events[event]) {
      this._events[event].push(callback);
    } else {
      console.warn(`Event ${event} is not supported.`);
    }
  }

  public kill(pid: number, signal?: NodeJS.Signals | number): void {
    process.kill(pid, signal ?? 'SIGTERM');
  }

  set command(value: string) {
    this._command = value;
  }

  set args(value: string[]) {
    this._args = value;
  }

  get pid(): number | null | undefined {
    return this._process?.pid;
  }

  private emit(event: keyof EventMap, data: any): void {
    if (this._events[event]) {
      this._events[event].forEach((callback) => callback(data));
    }
  }
}
