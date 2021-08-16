const Constants = require('./utils/constanst');
const Buttons = require('./utils/buttons');
const Logger = require('@developmentcubed/logger');
const Parsing = require('./utils/parsing');

const { nanoid } = require('nanoid');

/**
 * Creates the instance of InteractionListener.
 * @memberof InteractionListener
 */
class InteractionListener {
  constructor(bot) {
    this.bot = bot;

    /**
     * The Constants class
     * @type {Constants}
     */
    this.constants = new Constants();

    /**
     * The Buttons class
     * @type {Buttons}
     */
    this.buttons = new Buttons(this);

    /**
     * The Logger class
     * @type {Logger}
     */
    this.logger = new Logger();

    /**
     * The Parsing class
     * @type {Parsing}
     */
    this.parsing = new Parsing(this);

    this.eventListeners = [];
  }

  /**
   * Starts up the package
   * @memberof InteractionListener
   */
  start() {
    const self = this;
    self.bot.on('rawWS', (packet, id) => {
      self.handler(self, packet, id);
    });
  }

  /**
   * The handler of each component
   * @memberof InteractionListener
   */
  handler(self, packet, id) {
    if (packet.t !== 'INTERACTION_CREATE') return;
    this.SendPost(packet.d.id, packet.d.token);
    const keys = Object.keys(this.eventListeners);
    for (let i = 0; i < keys.length; i++) {
      const element = this.eventListeners[keys[i]];
      element(packet.d, id, keys[i]);
    }
  }

  /**
   * Sends a confirmation post for each interation
   * @memberof InteractionListener
   */
  SendPost(id, token) {
    const endpoint = `/interactions/${id}/${token}/callback`;
    try {
      this.bot.requestHandler.request('POST', endpoint, true, {
        type: 7,
      });
    } catch (error) {
      this.logger.error('Error sending post to API', error.toString());
    }
    return;
  }

  /**
   * Adds a listener for each component
   * @memberof InteractionListener
   */
  addListener(event) {
    const id = nanoid();
    this.eventListeners[id] = event;
    return id;
  }

  /**
   * Removes a listener for each component
   * @memberof InteractionListener
   */
  removeListener(eventID) {
    const keys = Object.keys(this.eventListeners);
    let index = keys.indexOf(eventID);
    if (index !== -1) {
      this.eventListeners.splice(index, 1);
    }
  }
}

module.exports = InteractionListener;
