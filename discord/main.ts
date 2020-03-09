import { client } from '../state';
import handlers from '../handlers';;
import { Message as DiscordMessage } from 'discord.js';
import { load } from '../save';
import { translateDiscordMessage, sendReplyToDiscord } from './adaptor';
import DiscordMessagingEnvironment from './DiscordMessagingEnvironment';
import * as dotenv from 'dotenv';

dotenv.config();
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
const env = new DiscordMessagingEnvironment(client);

client.on('message', async (msg: DiscordMessage) => {
  if (!msg || !msg.id || ['dm', 'text'].indexOf(msg.type) === -1) {
    return; // Ignore weird messages.
  }
  if (msg.member && client.user && msg.member.id === client.user.id) {
    return; // Ignore own messages.
  }
  let recognized = false;
  const message = await translateDiscordMessage(msg);
  const handlersInst = handlers(state, message, env);
  for (const handler of handlersInst) {
    recognized = await handler.handlesMessage();
    if (recognized) {
      const reply = await handler.reply();
      sendReplyToDiscord(msg, reply);
    }
  }
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

start();
