# Logger

A simple logger for your projects

```js
const Logger = require('@developmentcubed/logger');

const logger = new Logger(); // Writes log files to CWD
const logger2 = new Logger('/var/log/project'); // Writes log files to a directory of your choosing

logger.setLevel(logger.DEBUG);

logger.debug('Hello yes this is a debug message');
logger.info('Hello yes this is a info message with', 3, 'args');
logger.success('Spoopy it was a success');
logger.warning('Knock it off dude');
logger.error('Errors everywhere');
logger.notice('Notice me uwu');
```

![What it looks like](https://carbon.pics/nIxxICM8i)
