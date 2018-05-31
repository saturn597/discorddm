const Discord = require('discord.js');
const readline = require('readline');

const secrets = require('./secrets.js');
const token = secrets.token;

const client = new Discord.Client();

client.on('ready', () => {
  console.log('Logged in!');
});

client.login(token).
  catch((e) => console.log('Login unsuccessful'));
