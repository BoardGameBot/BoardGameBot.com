import { client } from './state';
import handlers from './handlers';
import { isAnyCommand } from './util';
import { Message } from 'discord.js';
import { load } from './save';

function start() {
  const token = process.env.DISCORD_TOKEN;
  if (!token) {
    throw new Error('No token found!!');
  } else {
    console.log('Using token: "' + token + '"');
  }
  client.login(token);
}

const state = load();

client.on('message', async (msg: Message) => {
  if (msg.member && client.user && msg.member.id === client.user.id) {
    return; // Ignore own messages.
  }
  let recognized = false;
  const handlersInst = handlers(state, msg as Message);
  for (const handler of handlersInst) {
    recognized = await handler.handlesMessage();
    if (recognized) {
      await handler.reply();
      break;
    }
  }
  if (!recognized && isAnyCommand(state.channels[msg.channel.id], msg)) {
    msg.channel.send(`Command not recognized. Use ".help" for help.`);
  }
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

start();