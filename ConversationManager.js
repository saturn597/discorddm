class ConversationManager {
  constructor(client, maxMessages = 50) {
    this.client = client;
    this.conversations = new Map();
    this.maxMessages = maxMessages;
  }

  getConversation(friend) {
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
}

module.exports = ConversationManager;
