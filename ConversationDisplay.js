const blessed = require('blessed');


class ConversationDisplay extends blessed.Box {
  constructor(...args) {
    super(...args);
  }

  display(messages) {
    if (messages) {
      this.setContent(this.messagesToString(messages));
    } else {
      this.setContent('<No message history>');
    }
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
