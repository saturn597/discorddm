class ConversationManager {
  constructor(client, maxMessages = 50, onMessage = () => {}) {
    this.client = client;
    this.maxMessages = maxMessages;
    this.onMessage = onMessage;

    // Map of channels to cached records of the messages we've gotten on them.
    this.conversations = new Map();

    this.client.on('message', this.processMessage.bind(this));
  }

  friendToConversation(friend) {
    if (!friend.dmChannel) {
      return Promise.resolve(null);
    }

    return this.channelToConversation(friend.dmChannel);
  }

  channelToConversation(channel) {
    const conv = this.conversations.get(channel);
    if (conv) {
      return Promise.resolve(conv);
    }

    // TODO: potential case to handle: if this is called >1 time before the
    // messages come back from Discord, maybe we wait for the first message
    // to be resolved rather than fetching from Discord twice.
    return channel.fetchMessages({ max: this.maxMessages}).
      then(messages => {
        this.conversations.set(channel, messages);
        return messages;
      });
  }

  processMessage(message) {
    if (message.channel.type === 'dm') {
      this.channelToConversation(message.channel).then(conv => {
        // TODO: is there a case where !conv?
        conv.set(message.id, message);
        this.onMessage(message);
      });
    }
  }
}

module.exports = ConversationManager;
