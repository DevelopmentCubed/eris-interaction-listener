const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const { inspect } = require('util');

class Logger {
  constructor(logPath = path.join(process.cwd(), 'logs')) {
    this.level = { name: ' info  ', value: 1 };
    this.PATH = logPath;
    this.DEBUG = { name: ' debug ', value: 0 };
    this.INFO = { name: ' info  ', value: 1 };
    this.SUCCESS = { name: 'success', value: 2 };
    this.WARNING = { name: 'warning', value: 3 };
    this.ERROR = { name: ' error ', value: 4 };
    this.NOTICE = { name: 'notice ', value: 5 };
  }

  setLevel(level) {
    if (level.value < 0 || level.value > 4) {
      console.log(chalk.redBright('Invalid level passed to setLevel'));
    } else this.level = level;
  }

  checkLevel(level) {
    return level.value >= this.level.value;
  }

  getTime(time = false) {
    return time
      ? new Date().toLocaleTimeString()
      : `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
  }

  writeLine(level, line) {
    if (!fs.existsSync('logs')) fs.mkdirSync('logs');
    const date = this.getTime();
    const output = path.join(this.PATH, 'output.log');
    try {
      const stat = fs.statSync(output);
      if (new Date() - stat.birthtimeMs >= 8.64e7) {
        const newName = `output-${new Date(stat.birthtimeMs).toLocaleDateString(
          'en-CA',
        )}.log`;
        fs.renameSync(output, path.join(this.PATH, newName));
      }
      fs.appendFileSync(output, `${date} [${level.name}] ${line}\n`);
    } catch (error) {
      fs.writeFileSync(output, `${date} [${level.name}] ${line}\n`);
    }
  }

  debug(...args) {
    if (!this.checkLevel(this.DEBUG)) return;
    this.execute(this.DEBUG, ...args);
  }

  info(...args) {
    if (!this.checkLevel(this.INFO)) return;
    this.execute(this.INFO, ...args);
  }

  success(...args) {
    if (!this.checkLevel(this.SUCCESS)) return;
    this.execute(this.SUCCESS, ...args);
  }

  warning(...args) {
    if (!this.checkLevel(this.WARNING)) return;
    this.execute(this.WARNING, ...args);
  }

  error(...args) {
    if (!this.checkLevel(this.ERROR)) return;
    this.execute(this.ERROR, ...args);
  }

  notice(...args) {
    if (!this.checkLevel(this.NOTICE)) return;
    this.execute(this.NOTICE, ...args);
  }

  execute(level, ...args) {
    const actual = [];
    for (const arg of args) {
      if (typeof arg === 'object') {
        actual.push(inspect(arg));
      } else actual.push(arg);
    }
    const line = actual.join(' ');
    this.writeLine(level, line);
    let name = '';
    switch (level.value) {
      case 0:
        name = chalk.gray(level.name);
        break;
      case 1:
        name = chalk.blue(level.name);
        break;
      case 2:
        name = chalk.greenBright(level.name);
        break;
      case 3:
        name = chalk.yellowBright(level.name);
        break;
      case 4:
        name = chalk.redBright(level.name);
        break;
      case 5:
        name = chalk.bgRedBright(level.name);
        break;
    }
    console.log(`${this.getTime(true)} [${name}] ${line}`);
  }
}

module.exports = Logger;
