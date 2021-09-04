const EventEmitter = require('eventemitter3');

/**
 * @typedef {Object} InteractionObject
 * @property {string} channelID - Channel interaction happened in
 * @property {string} guildID - Guild interaction happened in
 * @property {string} id - ID of interaction
 * @property {number} componentType - Component Type
 * @property {string} customID - Custom ID of interaction
 * @property {string[] | undefined} values - Values from select menu
 * @property {object} member - Member interacting only present if ran in a guild
 * @property {object} user - User interacting only present if ran in DM
 * @property {object} message - Message object that the interaction is on
 * @property {string} token - Token of interaction
 * @property {number} type - Type of interaction
 * @property {number} version - Version?
 */

class Interactions extends EventEmitter {
	/**
	 * Creates an instance of Interactions.
	 * @param {import('eris').Client} client
	 * @memberof Interactions
	 */
	constructor(client) {
		super();

		this.interactionCallbackType = {
			PONG: 1,
			CHANNEL_MESSAGE_WITH_SOURCE: 4,
			DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE: 5,
			DEFERRED_UPDATE_MESSAGE: 6,
			UPDATE_MESSAGE: 7,
		};

		this.buttonStyles = {
			blurple: 1,
			grey: 2,
			green: 3,
			red: 4,
			link: 5,
		};

		this.client = client;
		this.client.on('rawWS', (packet) => {
			if (packet.t === 'INTERACTION_CREATE') this.handle(packet.d);
		});
	}

	/**
	 * @private
	 * @param {any} packet - Raw websocket packet sent by Discord.
	 * @memberof Interactions
	 * @fires Interactions#interaction
	 */
	handle(packet) {
		const object = {
			channelID: packet.channel_id,
			guildID: packet.guild_id,
			id: packet.id,
			componentType: packet.data.component_type,
			customID: packet.data.custom_id,
			values: packet.data.values,
			member: packet.member,
			user: packet.user,
			message: packet.message,
			token: packet.token,
			type: packet.type,
			version: packet.version,
		};

		/**
		 * Interaction event
		 *
		 * @event Interactions#interaction
		 * @type {InteractionObject}
		 */
		this.emit('interaction', object);
	}

	/**
	 *	Confirm that an interaction has been received and handled
	 *
	 * @param {InteractionObject} interaction
	 * @param {'PONG' | 'CHANNEL_MESSAGE_WITH_SOURCE' | 'DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE' | 'DEFERRED_UPDATE_MESSAGE' | 'UPDATE_MESSAGE'} type
	 * @memberof Interactions
	 * @returns {Promise}
	 */
	confirmInteraction(interaction, type) {
		const types = ['PONG', 'CHANNEL_MESSAGE_WITH_SOURCE', 'DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE', 'DEFERRED_UPDATE_MESSAGE', 'UPDATE_MESSAGE'];
		if (!types.includes(type)) throw new TypeError(`Type must be one of the following: ${types.join(', ')}`);

		return this.client.requestHandler.request('POST', `/interactions/${interaction.id}/${interaction.token}/callback`, true, { type: this.interactionCallbackType[type] });
	}

	/**
	 * Create an action row that houses buttons and select menus
	 *
	 * @param {*} components
	 * @return {*}
	 * @memberof Interactions
	 */
	createActionRow(...components) {
		return { type: 1, components: [...components] };
	}

	/**
	 * Create an interaction button object
	 *
	 * @param {string} label - Button text user gets to see
	 * @param {'blurple' | 'grey' | 'green' | 'red'} style - Style or color of button
	 * @param {string} [ID=null] - Custom ID of button.
	 * @param {string} [URL=null] - URL of button
	 * @return {*}
	 * @memberof Interactions
	 */
	createButton(label, style, ID = null, URL = null, emoji = null) {
		if (!label || !style || (!ID && !URL)) throw new Error('Invalid button params.');
		if (!this.buttonStyles[style]) style = 'blurple';

		if (emoji) emoji = this.formatEmoji(emoji);

		if (ID)
			return {
				type: 2,
				label,
				style: this.buttonStyles[style],
				custom_id: ID,
				emoji,
			};

		if (URL)
			return {
				type: 2,
				label,
				style: this.buttonStyles.link,
				url: URL,
				emoji,
			};
	}

	/**
	 * Create an interactive selection menu
	 *
	 * @param {string} ID - Custom ID for this select menu
	 * @param {string} placeholder - Text shown to user when they haven't selected anything
	 * @param {number} min - Minimum amount of options the user has to select
	 * @param {number} max - Maximum amount of options the user can select
	 * @param {object[]} options - Option objects
	 * @return {*}
	 * @memberof Interactions
	 */
	createSelectMenu(ID, placeholder, min, max, options) {
		min = parseInt(min);
		max = parseInt(max);
		if (!ID || !placeholder || isNaN(min) || isNaN(max) || !options.length) throw new Error('Invalid select params.');

		return {
			type: 3,
			custom_id: ID,
			placeholder,
			min_values: min,
			max_values: max,
			options,
		};
	}

	/**
	 * Create select menu item
	 *
	 * @param {string} label - Label the user see
	 * @param {string} value - Value for item
	 * @param {string} description - Description user gets to see
	 * @param {string} [emoji=null] - Custom emoji or unicode Discord emoji.
	 * @return {*}
	 * @memberof Interactions
	 */
	createMenuItem(label, value, description, emoji = null) {
		if (!label || !value || !description) throw new Error('Invalid option params');
		if (emoji) emoji = this.formatEmoji(emoji);

		return {
			label,
			value,
			description,
			emoji,
		};
	}

	/**
	 * @private
	 */
	formatEmoji(emoji) {
		const cleaned = emoji.replace(/(<:)|(<)|(>)/g, '');
		const split = cleaned.split(':');
		const formatted = {};
		if (split[0] === 'a') {
			formatted.animated = true;
			split.splice(0, 1);
		}
		formatted.name = split[0];
		formatted.id = split[1] ?? null;
		return formatted;
	}
}

module.exports = Interactions;
