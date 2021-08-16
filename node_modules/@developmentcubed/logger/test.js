const Logger = require('./src/logger');

const logger = new Logger();

logger.setLevel(logger.DEBUG);

logger.debug('Hello yes this is a debug message');
logger.info('Hello yes this is a info message with', 3, 'args');
logger.success('Spoopy it was a success');
logger.warning('Knock it off dude');
logger.error('Errors everywhere');
logger.notice('Notice me uwu');
