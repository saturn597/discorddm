const blessed = require('blessed');


class ConversationDisplay extends blessed.Box {
  constructor(...args) {
    super(...args);

    this.key('up', () => {
      this.scroll(-1);
      this.screen.render();
    });

    this.key('down', () => {
      this.scroll(1);
      this.screen.render();
    });
  }

  display(messages) {
    if (messages) {
      this.setContent(this.messagesToString(messages));
    } else {
      this.setContent('<No message history>');
    }

    this.setScrollPerc(100);
  }

  messagesToString(messages) {
    return messages.array().
      sort((m1, m2) => m1.createdAt > m2.createdAt ? 1 : -1).
      map(this.messageToString).
      join('\n');
  }

  messageToString(m) {
    return `{bold}${m.author.username}#${m.author.discriminator}{/bold}: `+
      m.cleanContent;
  }
}

module.exports = ConversationDisplay;
