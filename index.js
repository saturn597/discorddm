const blessed = require('blessed');
const Discord = require('discord.js');
const fs = require('fs');

const ConversationDisplay = require('./ConversationDisplay.js');
const ConversationManager = require('./ConversationManager.js');
const FriendList = require('./FriendList.js');
const MessageInput = require('./MessageInput.js');
const styles = require('./styles.js');

// Default number of messages to show in history. This could be configurable.
const MAX_MESSAGES = 50;

const token = fs.readFileSync('./token', 'ascii').trim();

class DiscordDM {
  constructor() {
    this.onMessage = this.onMessage.bind(this);
    this.onFriendSwitch = this.onFriendSwitch.bind(this);

    const client = new Discord.Client();
    const conversationManager = new ConversationManager(client, MAX_MESSAGES,
        this.onMessage);
    this.conversationManager = conversationManager;

    const screen = blessed.screen({ smartCSR: true });
    screen.title = 'Discord';
    this.screen = screen;

    // Quit on Escape, q, or Control-C.
    screen.key(['escape', 'q', 'C-c'], function(ch, key) {
      return process.exit(0);
    });
    screen.ignoreLocked = ['C-c', 'escape', 'tab'];

    const friendList = new FriendList(styles.friendList);
    this.friendList = friendList;
    friendList.on('friendSelect', this.onFriendSwitch);
    const messages = new ConversationDisplay(styles.messages);
    this.messages = messages;
    const input = new MessageInput(this.sendMessage.bind(this), styles.input);

    const focusables = [input, messages, friendList];
    let index = 1;
    focusables[index].focus();
    screen.key('tab', () => {
      // switch focus between different boxes
      index = index < focusables.length - 1 ? index + 1 : 0;
      focusables[index].focus();
      screen.render();
		});

    [messages, input, friendList].forEach(e => screen.append(e));
    screen.render();

    client.on('ready', () => {
      // TODO: update on adding/removing friends
      friendList.setFriends(client.user.friends);
      friendList.friendSelect(0);
      screen.render();
    });

    client.login(token).
      catch((e) => {
          screen.destroy();
          console.log('Login unsuccessful. Maybe your token is incorrect?');
          process.exit();
      });
  }

  onMessage(msg) {
    const currentFriend = this.friendList.getCurrentSelection();
    // TODO: is there a case where currentFriend doesn't have a dmChannel?
    // (dmChannels can be deleted).
    if (currentFriend.dmChannel !== msg.channel) {
      // Highlight the friend who sent the message, if we're not already
      // viewing their messages
      this.friendList.highlight(msg.author);
      this.screen.render();
    } else {
      // If we currently have the message's author selected, need to show their new
      // messages
      this.conversationManager.friendToConversation(currentFriend).then(ms => {
        this.messages.display(ms);
        this.screen.render();
      });
    }
  }

  onFriendSwitch(u) {
    this.friendList.highlight(u, false);
    this.conversationManager.friendToConversation(u).then(ms => {
      this.messages.display(ms);
      this.screen.render();
    });
  }

  sendMessage(txt) {
    this.friendList.getCurrentSelection().send(txt);
  }
}


new DiscordDM();
