import {botSingleton, Bot} from './state';
import * as fs from 'fs';

const FILEPATH = __dirname + '/bot.json'; 

export function save() {
    const data = JSON.stringify(botSingleton, null, 2);
    fs.writeFile(FILEPATH, data, (err) => {
        if (err) {
            console.log('Error writing to file: ' + err);
        }
    });
} 

export function load(): Bot {
    return JSON.parse(fs.readFileSync(FILEPATH, "utf8"));
}