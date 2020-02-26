import { botSingleton, client } from './state';
import handlers from './handlers';
import { isAnyCommand } from './util';

function start() {
  const token = process.env.DISCORD_TOKEN;
  if (!token) {
    throw new Error('No token found!!');
  } else {
    console.log('Using token: "' + token + '"');
  }
  client.login(token);
}

client.on('message', (msg) => {
  if (msg.member.id === client.user.id) {
    return; // Ignore own messages.
  }
  let recognized = false;
  for (const handler of handlers) {
    recognized = handler.onMessage(msg);
    if (recognized) {
      break;
    }
  }
  if (!recognized && isAnyCommand(msg)) {
    msg.channel.send(`Command not recognized. Use ".help" for help.`);
  }
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

start();