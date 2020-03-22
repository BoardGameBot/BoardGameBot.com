import { Bot } from './state';
import * as fs from 'fs';

const FILEPATH = __dirname + '/../bot.json';
const DEFAULT_STATE: Bot = { channels: {} };

export async function save(state: Bot) {
  const data = JSON.stringify(state, null, 2);
  await fs.promises.writeFile(FILEPATH, data);
}

export function load(): Bot {
  let data;
  let state: Bot;
  try {
    data = fs.readFileSync(FILEPATH, 'utf8');
    state = JSON.parse(data);
  } catch (e) {
    if (e.code === 'ENOENT') {
      // file doesn't exist
      state = DEFAULT_STATE;
    }
  }
  return state;
}
