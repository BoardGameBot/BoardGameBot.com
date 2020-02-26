import { BotHandler } from './index';
import { botSingleton, client } from '../state';
import { Message } from 'discord.js';

export default class InstallHandler implements BotHandler {
    name = "Install";
    init() {
        client.on('message', msg => {
            if (msg.isMentioned(client.user) && msg.content.toLowerCase().includes('.enable')) {
                if (msg.member.hasPermission('KICK_MEMBERS', true, true)) {
                    this.enable(msg);
                } else {
                    msg.reply('Sorry, you need to be a server admin/owner to do that.');
                }
            }
        });
    };

    private enable(msg: Message) {
        let channel = botSingleton.channels[msg.channel.id];
        if (!channel) {
            channel = { enabled: false };
            botSingleton.channels[msg.channel.id] = channel;
        }
        if (!channel.enabled) {
            botSingleton.channels[msg.channel.id] = { enabled: true };
            msg.reply('I am now enabled for this channel. Use ".help" to see all available commands.');
        } else {
            msg.reply('I am already enabled for this channel. If you want to disable me, use ".disable".');
        }
    }
}