import { Bot } from './state';
import * as fs from 'fs';

const FILEPATH = __dirname + '/../bot.json';

export function save(state: Bot) {
  const data = JSON.stringify(state, null, 2);
  fs.writeFile(FILEPATH, data, err => {
    if (err) {
      console.log('Error writing to file: ' + err);
    }
  });
}

export function load(): Bot {
  return JSON.parse(fs.readFileSync(FILEPATH, 'utf8'));
}
