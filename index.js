const blessed = require('blessed');
const Discord = require('discord.js');

const secrets = require('./secrets.js');
const token = secrets.token;
const ConversationDisplay = require('./ConversationDisplay.js');
const ConversationManager = require('./ConversationManager.js');
const FriendsList = require('./FriendsList.js');
const styles = require('./styles.js');

// Default number of messages to show in history. This could be configurable.
const MAX_MESSAGES = 50;


class DiscordDM {
  constructor() {
    const client = new Discord.Client();
    const conversationManager = new ConversationManager(client, MAX_MESSAGES);

    const screen = blessed.screen({ smartCSR: true });
    screen.title = 'Discord';
    const rerender = screen.render.bind(screen);

    // Quit on Escape, q, or Control-C.
    screen.key(['escape', 'q', 'C-c'], function(ch, key) {
      return process.exit(0);
    });

    // TODO: consider making another method of DiscordDM
    const onFriendSwitch = u => {
      conversationManager.friendToConversation(u).then(ms => {
        messages.display(ms);
        screen.render();
      });
    };

    const friendList = new FriendsList(onFriendSwitch, styles.friendList);
    const messages = new ConversationDisplay(rerender, styles.messages);
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
      screen.render();
    });

    client.login(token).
      catch((e) => {
          screen.destroy();
          console.log('Login unsuccessful. Maybe your token is incorrect?');
          process.exit();
      });
    }
}


new DiscordDM();
