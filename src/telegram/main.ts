import handlers from '../handlers';
import { load } from '../save';
import { translateTelegramMessage, sendReplyToTelegram } from './adaptor';
import TelegramMessagingEnvironment from './TelegramMessagingEnvironment';
import * as dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';
import Logger from '../Logger';

dotenv.config();

let client: TelegramBot;

const logger = new Logger();

function start() {
  const token = process.env.TELEGRAM_TOKEN;
  if (!token) {
    throw new Error('No token found!!');
  }
  logger.info('Using token: "' + token + '"');
  client = new TelegramBot(token, { polling: true });
  client.on('message', async (msg: TelegramBot.Message) => {
    if (!msg) {
      return; // Ignore weird messages.
    }
    handleMessage(client, msg);
  });
}

const state = load();
const env = new TelegramMessagingEnvironment(client);

async function handleMessage(client: TelegramBot, msg: TelegramBot.Message) {
  let recognized = false;
  const message = await translateTelegramMessage(msg);
  const handlersInst = handlers(state, message, env);
  for (const handler of handlersInst) {
    recognized = await handler.handlesMessage();
    if (recognized) {
      const reply = await handler.reply();
      sendReplyToTelegram(client, msg, reply);
      break;
    }
  }
}

start();
