const blessed = require('blessed');
const Discord = require('discord.js');
const readline = require('readline');
const snekfetch = require('snekfetch');

const secrets = require('./secrets.js');
const token = secrets.token;

const client = new Discord.Client();

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

  height: '90%-1',
  width: '80%-1',
});

const input = blessed.box({
  border: {
    type: 'line',
  },

  top: '90%',
  height: '10%',
  width: '80%-1',
});

const friendList = blessed.list({
  border: {
    type: 'line',
  },
  keys: true,
  style: {
    selected: {
      bg: 'magenta',
    },
  },

  left: '80%',
  height: '99%',
  width: '20%',
});

friendList.on('select', e => {
  const arr = e.content.split('#');
  const u = client.user.friends.
    find(u => u.username == arr[0] && u.discriminator == arr[1]);
  if (u.dmChannel) {
    u.dmChannel.fetchMessages().then(messages => {
      main.setContent(messages.map(m => m.cleanContent).join('\n'));
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
