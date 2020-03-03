import { Message } from 'discord.js';
import { botSingleton, GameChannel } from '../state';

export class BotHandler {
    name: String;
    msg: Message;
    channel: GameChannel | undefined;

    constructor(msg: Message) {
        this.msg = msg;
        this.channel = botSingleton.channels[msg.channel.id];
    }

    // Whether or not this specific handler cares about this message.
    public async handlesMessage(): Promise<boolean> { return Promise.resolve(false); }

    // Reply to the message (will only be called when handlesMessage returns true).
    public async reply(): Promise<void> { }

    // Shorthand for sending message backs to the channel.
    public send(content: String) {
        this.msg.channel.send(content);
    }

    // Shorthand for sending message privately to the author.
    public pvt(content: String) {
        this.msg.author.send(content);
    }

};