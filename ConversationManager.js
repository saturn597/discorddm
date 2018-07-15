class ConversationManager {
  constructor(client, maxMessages = 50, onMessage = () => {}) {
    this.client = client;
    this.conversations = new Map();
    this.maxMessages = maxMessages;
    this.onMessage = onMessage;

    this.client.on('message', this.processMessage.bind(this));
  }

  getConversation(friend) {
    // TODO: this should maybe search based on channels, not on friends (would
    // make this more general - group DM channels and guild channels aren't
    // necessarily tied to a single user).
    if (!friend.dmChannel) {
      return Promise.resolve(null);
    }

    const conv = this.conversations.get(friend);
    if (conv) {
      return Promise.resolve(conv);
    }

    // TODO: potential case to handle: if this is called >1 time before the
    // messages come back from Discord, maybe we wait for the first message
    // to be resolved rather than fetching from Discord twice.
    return friend.dmChannel.fetchMessages({ max: this.maxMessages}).
      then(messages => {
        this.conversations.set(friend, messages);
        return messages;
      });
  }

  processMessage(message) {
    if (message.channel.type === 'dm') {
      this.getConversation(message.author).then(conv => {
        if (!conv) {
          // TODO: handle - this happens if, e.g., we wrote the message.
          return;
        }
        conv.set(message.id, message);
        this.onMessage(message);
      });
    }
  }
}

module.exports = ConversationManager;
