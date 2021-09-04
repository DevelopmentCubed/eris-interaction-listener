# What is this?

A simple handler for button interactions with eris.

# Installation

`npm i -S eris-interaction-listener`

# Example

```js
const Eris = require('eris');
const Interactions = require('eris-interaction-listener');

const bot = new Eris('token');

const interactions = new Interactions(bot);

bot.on('messageCreate', async (event) => {
	if (event.author.bot) return;

	if (event.content === '!buttons') {
		const message = await bot.createMessage(event.channel.id, {
			content: 'Awesome buttons',
			components: [
				interactions.createActionRow(
					interactions.createButton('Option 1', 'blurple', 'option1'),
					interactions.createButton('Option 2', 'grey', 'option2'),
					interactions.createButton('Option 3', 'red', 'option3'),
					interactions.createButton('Option 4', 'green', 'option4'),
				),
			],
		});

		let timer = null;

		const handle = async (interaction) => {
			if (interaction.message.id !== message.id || interaction.member.user.id !== event.author.id) return;
			try{

				await interactions.confirmInteraction(interaction, 'UPDATE_MESSAGE');
			}
			catch(err){
				return console.error(err);
				// failed to ACK an interaction. Either log it or send in a crash report log.
			}

			message.edit({
				content: `You clicked the button with custom ID \`${interaction.customID}\``,
				components: [],
			});
			interactions.off('interaction', handle);
			clearTimeout(timer);
		};

		interactions.on('interaction', handle);

		timer = setTimeout(() => {
			interactions.off('interaction', handle);
			message.edit({ content: 'Time out', components: [] });
		}, 6e4);
	}

	if (event.content === '!select') {
		const message = await bot.createMessage(event.channel.id, {
			content: 'Awesome menu',
			components: [interactions.createActionRow(interactions.createSelectMenu('menu', 'Pick an option', 1, 1, [interactions.createMenuItem('Dogs', 'dog', 'You like dogs', '🐶'), interactions.createMenuItem('Cats', 'cats', 'You like cats', '🐱')]))],
		});

		let timer = null;

		const handle = async (interaction) => {
			if (interaction.message.id !== message.id || interaction.member.user.id !== event.author.id) return;
			try{

				await interactions.confirmInteraction(interaction, 'UPDATE_MESSAGE');
			}
			catch(err){
				return console.error(err);
				// Failed to ACK an interaction. Either log it or send in a crash report log.
			}

			message.edit({
				content: `You like ${interaction.values[0] === 'dog' ? 'dogs' : 'cats'} more.`,
				components: [],
			});
			interactions.off('interaction', handle);
			clearTimeout(timer);
		};

		interactions.on('interaction', handle);

		timer = setTimeout(() => {
			interactions.off('interaction', handle);
			message.edit({ content: 'Time out', components: [] });
		}, 6e4);
	}
});

bot.connect();

```