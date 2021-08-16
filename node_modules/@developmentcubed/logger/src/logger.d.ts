declare class Logger extends ILogger {
  /**
   * Provide a new path for logs to be saved to if you don't want logs to go to CWD/logs
   * @param {string} [path] - New path for logs
   */
  constructor(path?: string);
  level: ILogLevel;
  DEBUG: ILogLevel;
  INFO: ILogLevel;
  SUCCESS: ILogLevel;
  WARNING: ILogLevel;
  ERROR: ILogLevel;
  NOTICE: ILogLevel;

  debug(...arg: any[]): void;
  info(...arg: any[]): void;
  success(...arg: any[]): void;
  warning(...arg: any[]): void;
  error(...arg: any[]): void;
  notice(...arg: any[]): void;

  setLevel(level: 0 | 1 | 2 | 3 | 4): void;
  checkLevel(level: 0 | 1 | 2 | 3 | 4): boolean;
  writeLine(line: string): void;
}

interface ILogLevel {
  value: number;
  name: string;
}

export = Logger;
