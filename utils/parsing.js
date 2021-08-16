class Parsing {
  /** @param {import('../index')} caller */
  constructor(caller) {
    this.bot = caller.bot;
    this.constants = caller.constants;
    this.logger = caller.logger;
  }

  /**
   * Parse an emoji
   * @param {string} emoji
   * @returns
   * @memberof Parsing
   */
  parseEmoji(emoji) {
    const parsed = emoji.replace(/(<:)|(<)|(>)/g, '');
    const string = parsed.split(':');
    let animated = false;
    let name = string[0];
    let id = string[1];
    if (string[0] === 'a') {
      name = string[1];
      animated = true;
      id = string[2];
    }
    return {
      parsed,
      name,
      id,
      animated,
      emoji: parsed.indexOf(':') !== -1 ? `${parsed.startsWith('a:') ? '<' : '<:'}${parsed}>` : parsed,
    };
  }
}

module.exports = Parsing;
