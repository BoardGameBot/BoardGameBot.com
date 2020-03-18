import logger from 'loglevel';
import prefix from 'loglevel-plugin-prefix';
import chalk from 'chalk';

const colors = {
  TRACE: chalk.magenta,
  DEBUG: chalk.cyan,
  INFO: chalk.blue,
  WARN: chalk.yellow,
  ERROR: chalk.red
};

prefix.reg(logger);

/* istanbul ignore next */
export default class Logger {
  public logger: logger.Logger;

  constructor() {
    this.logger = logger;
    if (process.env.NODE_ENV === 'test') {
      // so jest doesn't get cluttered
      this.logger.setLevel(logger.levels.INFO);
    } else {
      this.logger.setLevel(logger.levels.DEBUG);
    }
  }
  debug(...msg: any) {
    const funcName = (new Error() as any).stack
      .split('\n')[2]
      .trim()
      .split(' ')[1];
    this.updatePrefix(funcName);
    this.logger.debug(...msg);
  }
  info(...msg: any) {
    const funcName = (new Error() as any).stack
      .split('\n')[2]
      .trim()
      .split(' ')[1];
    this.updatePrefix(funcName);
    this.logger.info(...msg);
  }
  warn(...msg: any) {
    const funcName = (new Error() as any).stack
      .split('\n')[2]
      .trim()
      .split(' ')[1];
    this.updatePrefix(funcName);
    this.logger.warn(...msg);
  }
  error(...msg: any) {
    const funcName = (new Error() as any).stack
      .split('\n')[2]
      .trim()
      .split(' ')[1];
    this.updatePrefix(funcName);
    this.logger.error(...msg);
  }
  disableAll() {
    this.logger.disableAll();
  }
  enableAll() {
    this.logger.enableAll();
  }
  updatePrefix(funcName?: string) {
    prefix.apply(this.logger, {
      format(level, _name, timestamp) {
        return `${chalk.gray(`[${timestamp}]`)} ${colors[level.toUpperCase()](level)} ${chalk.green(`${funcName}():`)}`;
      }
    });
  }
}