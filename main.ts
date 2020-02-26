import { botSingleton, client } from './state';
import handlers from './handlers';

function start() {
  const token = process.env.DISCORD_TOKEN;
  if (!token) {
    throw new Error('No token found!!');
  } else {
    console.log('Using token: "' + token + '"');
  }
  client.login(token);
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  for (const handler of handlers) {
    handler.init();
    console.log(`Initialized ${handler.name} handler.`);
  }
});

start();