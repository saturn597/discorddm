const blessed = require('blessed');
const Discord = require('discord.js');

const secrets = require('./secrets.js');
const token = secrets.token;
const ConversationDisplay = require('./ConversationDisplay.js');
const ConversationManager = require('./ConversationManager.js');
const FriendList = require('./FriendList.js');
const styles = require('./styles.js');

// Default number of messages to show in history. This could be configurable.
const MAX_MESSAGES = 50;


class DiscordDM {
  constructor() {
    this.onMessage = this.onMessage.bind(this);

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

    // TODO: consider making another method of DiscordDM
    const onFriendSwitch = u => {
      this.friendList.highlight(u, false);
      conversationManager.friendToConversation(u).then(ms => {
        messages.display(ms);
        screen.render();
      });
    };

    const friendList = new FriendList(styles.friendList);
    this.friendList = friendList;
    friendList.on('friendSelect', onFriendSwitch);
    const messages = new ConversationDisplay(styles.messages);
    this.messages = messages;
    const input = blessed.box(styles.input);

    const focusables = [input, messages, friendList];
    let index = 0;
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
    if (msg.author != this.friendList.getCurrentSelection()) {
      // Highlight the friend who sent the message, if we're not already
      // viewing their messages
      this.friendList.highlight(msg.author);
      this.screen.render();
    } else {
      // If we currently have the message's author selected, need to show their new
      // messages
      this.conversationManager.friendToConversation(msg.author).then(ms => {
        this.messages.display(ms);
        this.screen.render();
      });
    }
  }
}


new DiscordDM();
