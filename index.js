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

const tokenPath = './token';


class DiscordDM {
  constructor(token) {
    this.friendSwitch = this.friendSwitch.bind(this);
    this.gotMessage = this.gotMessage.bind(this);
    this.sendMessage = this.sendMessage.bind(this);

    const client = new Discord.Client();

    client.on('ready', () => {
      // Client ready event indicates successful log in
      console.log('Logged in!');
      this.setupUI(client);
    });

    // Now we're ready to log in
    client.login(token).
      catch((e) => {
        console.log('\nLogin unsuccessful. Maybe your token is incorrect?\n');
        process.exit();
      });
  }

  friendSwitch(u) {
    this.friendList.highlight(u, false);
    this.conversationManager.friendToConversation(u).then(ms => {
      this.messages.display(ms);
      this.screen.render();
    });
  }

  gotMessage(msg) {
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

  sendMessage(txt) {
    this.friendList.getCurrentSelection().send(txt);
  }

  setupUI(client) {
    this.screen = blessed.screen({ smartCSR: true });

    this.conversationManager = new ConversationManager(client, MAX_MESSAGES,
        this.gotMessage);
    this.friendList = new FriendList(styles.friendList);
    this.input = new MessageInput(this.sendMessage, styles.input);
    this.messages = new ConversationDisplay(styles.messages);

    const screen = this.screen;
    const friendList = this.friendList;
    const input = this.input;
    const messages = this.messages;

    screen.title = 'Discord';

    friendList.on('friendSelect', this.friendSwitch);

    // Quit on Escape, q, or Control-C.
    screen.key(['escape', 'q', 'C-c'], () => {
      screen.destroy();
      console.log('Bye!');
      return process.exit(0);
    });

    // Set up focus switching
    const focusables = [input, messages, friendList];
    let index = 1;
    focusables[index].focus();
    screen.key('tab', () => {
      // switch focus between different boxes
      index = index < focusables.length - 1 ? index + 1 : 0;
      focusables[index].focus();
      screen.render();
    });

    // These keys should always have their effect, even from the message input
    screen.ignoreLocked = ['C-c', 'escape', 'tab'];

    // Add all elements to screen
    [friendList, input, messages].forEach(e => screen.append(e));

    // TODO: update friendList on adding/removing friends
    friendList.setFriends(client.user.friends);
    friendList.friendSelect(0);

    screen.render();
  }
}


fs.readFile(tokenPath, 'ascii', (e, token) => {
  if (e) {
    console.log(
        '\nError opening token file!\n' +
        '------------------------\n' +
        'Put your Discord secret token in a plain text file called "token".\n' +
        'Put that file in the same directory as index.js. Then try again.\n');
    process.exit();
  } else {
    console.log('Logging in to Discord...');
    new DiscordDM(token.trim());
  }
});
