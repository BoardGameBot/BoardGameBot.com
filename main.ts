import * as Discord from 'discord.js';

const client = new Discord.Client();
const token = process.env.DISCORD_TOKEN;
if (!token) {
  throw new Error('No token found!!');
} else {
  console.log('Using token: '+ token);
}
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('Pong!');
  }
});

client.login(token);
