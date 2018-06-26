const blessed = require('blessed');
const Discord = require('discord.js');
const readline = require('readline');
const snekfetch = require('snekfetch');

const secrets = require('./secrets.js');
const token = secrets.token;

const client = new Discord.Client();

// Default number of messages to show in history. This could be configurable.
const MAX_MESSAGES = 50;

const screen = blessed.screen({ smartCSR: true });
screen.title = 'Discord';

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

const main = blessed.box({
  border: {
    type: 'line',
  },
  content: 'Connecting...',
  style: getBasicStyle(),
  tags: true,

  height: '90%-1',
  width: '80%-1',
});

const input = blessed.box({
  border: {
    type: 'line',
  },
  style: getBasicStyle(),

  top: '90%',
  height: '10%',
  width: '80%-1',
});

const friendList = blessed.list({
  border: {
    type: 'line',
  },
  keys: true,
  style: getBasicStyle(),

  left: '80%',
  height: '99%',
  width: '20%',
});

friendList.style.selected = {
  bg: 'magenta'
};

friendList.on('select', e => {
  const arr = e.content.split('#');
  const u = client.user.friends.
    find(u => u.username == arr[0] && u.discriminator == arr[1]);
  if (u.dmChannel) {
    u.dmChannel.fetchMessages({ max: MAX_MESSAGES }).then(messages => {
      main.setContent(messagesToString(messages));
      screen.render();
    });
  } else {
    main.setContent('<No message history>');
    screen.render();
  }
});

[main, input, friendList].forEach(e => screen.append(e));
screen.render();

client.on('ready', () => {
  friendList.setItems(
      client.user.friends.map(f => f.username + '#' + f.discriminator));
  friendList.focus();
  screen.render();
});

client.login(token).
  catch((e) => {
      screen.destroy();
      console.log('Login unsuccessful. Maybe your token is incorrect?');
      process.exit();
  });


function getBasicStyle() {
  // Using a function to fetch a new version of the style for each widget.
  // Having a single shared object causes issues.
  return  {
    border: {
      fg: 'white',
    },
    focus: {
      border: {
        fg: 'green',
      },
    },
  }
}

function messagesToString(messages) {
    return messages.array().
      sort((m1, m2) => m1.createdAt > m2.createdAt ? 1 : -1).
      map(messageToString).
      join('\n');
}

function messageToString(m) {
  return `{bold}${m.author.username}#${m.author.discriminator}{/bold}: `+
    m.cleanContent;
}
