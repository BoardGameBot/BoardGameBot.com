import { Bot } from './state';
import * as fs from 'fs';

const FILEPATH = __dirname + '/../bot.json';

export async function save(state: Bot) {
    const data = JSON.stringify(state, null, 2);
    await fs.promises.writeFile(FILEPATH, data);
}

export function load(): Bot {
    return JSON.parse(fs.readFileSync(FILEPATH, 'utf8'));
}
