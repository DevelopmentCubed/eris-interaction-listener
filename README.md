# What is this?

A simple handler for button interactions with eris.
(support for selection menus to come soon)

# Installation

`npm i eris-interaction-listener --save`

Then..

```
const Listener = require('eris-interaction-listener');

this.listener = new Listener(this.bot);

// on ready
this.listener.startListener();

//in command
//to start
const ID = this.listener.addListener(handler); //handler is where the event starts to listen for your unique custom_id's

//if using this for something like pagination, upon deletion or timeout
this.listener.removeListener(ID);

```

# Making buttons

```
//styles = { blurple, grey/gray, green, red, url }

this.listener.buttons.addActionRowButtons(number, labels, styles, customIDs);

  /**
   * {number} = amount of buttons (limit 5)
   * [labes] = Array of labels
   * [styles] = Array of styles
   * [custom_IDs] = Array of custom ids
   */
```

# Examples:

```
this.listener.buttons.addActionRowButtons(3, ['Back', 'Delete', 'Forward], ['blurple', 'red', 'blurple'], ['back', 'delete', 'forward']);

//returns
[
  {
    type: 1,
    components: [
      {
        type: 2,
        label: 'Back',
        style: 1, //blurple
        custom_id: 'back'
      },
            {
        type: 2,
        label: 'Delete',
        style: 4, //red
        custom_id: 'delete'
      },
            {
        type: 2,
        label: 'Forward',
        style: 1, //blurple
        custom_id: 'forward'
      },
    ]
  }
]
```

# Usage

```
this.bot.createMessage(channel.id {
  content: '',
  components: this.listener.buttons.addActionRowButtons(3, ['Back', 'Delete', 'Forward], ['blurple', 'red', 'blurple'], ['back', 'delete', 'forward']);
  embed: {
    title: 'Title',
    color: 0,
    description: 'Description'
  },
});
```

# Other

```
this.listener.buttons.addActionRowButtons(number, [labels], [styles], [customIDs]);
//returns as seen above

this.listener.buttons.addButtons(number, [labels], [styles], [customIDs]);
//returns
[
      {
        type: 2,
        label: label[i],
        style: style[i],
        custom_id: customID[i]
      },
]


this.listener.buttons.addURLButtons(number, [labels], [urls]); //defaults style to URL
//returns
[
      {
        type: 2,
        label: label[i],
        style: 5,
        url: url[i]
      },
]

//Emoji's must be a full string (if custom) or Unidode per string in the array (Ex: ['<:thisEmoji:12345678910>'])

this.listener.buttons.addEmojiButtons((number, [emojis], [styles], [customIDs], [labels] = false)) //labels default to false, but can still be added
//returns
[
      {
        type: 2,
        label: label ? label[i] : '',
        style: style[i],
        custom_id: customID[i],
        emoji: {
          name: emojiName, //(will be parsed from full string)
          id: emojiID, //(will be parsed from full string)
          animated: Boolean, //(will be parsed from full string)
        }
      },
]
```
