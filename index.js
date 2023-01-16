class Interactions {
	constructor() {
		this.buttonStyles = {
			blurple: 1,
			grey: 2,
			green: 3,
			red: 4,
			link: 5,
		};

		this.textFieldStyles = {
			short: 1,
			paragraph: 2
		}
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
	 * Create an interactive Text Field
	 *
	 * @param {string} ID - Custom ID for this Text Field
	 * @param {string} label - Label for this Text Field
	 * @param {'short' | 'paragraph'} style - Text Field Style
	 * @param {string} placeholder - Text shown to user when they haven't entered anything
	 * @param {Boolean} required - Is this required?
	 * @param {string} value - text pre-filled in the text field
	 * @param {number} min - Minimum amount of characters the user has to enter
	 * @param {number} max - Maximum amount of characters the user has to enter
	 * @return {*}
	 * @memberof Interactions
	 */
	createTextField(ID, label, style = 1, placeholder = 'Enter Text', required = false, value = '', min = 0, max = 4000) {
		min = parseInt(min);
		max = parseInt(max);
		if (!ID || !style || !label) throw new Error('Invalid select params.');
		if (!this.textFieldStyles[style]) style = 1;
		else style = this.textFieldStyles[style];

		return {
			type: 4,
			custom_id: ID,
			label,
			style,
			placeholder,
			required,
			value,
			min_length: min,
			max_length: max
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
