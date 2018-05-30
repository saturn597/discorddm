const Discord = require('discord.js');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

const client = new Discord.Client();

client.on('ready', () => {
  console.log('Logged in!')
});

rl.once('line', (token) => {
  client.login(token).
    catch((e) => console.log('Login unsuccessful'));
});
