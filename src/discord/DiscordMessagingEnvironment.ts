import { MessagingEnvironment } from "../MessagingEnvironment";
import { Client, Guild } from "discord.js";
import { User, Channel } from "../messaging";
import * as assert from "assert";
import { Namespace } from "../id";


export default class DiscordMessagingEnvironment extends MessagingEnvironment {
    client: Client;

    constructor(client: Client) {
        super();
        this.client = client;
    }

    async isAdmin(user: User, channel: Channel) {
        assert(user.id.namespace === Namespace.DISCORD);
        assert(channel.id.namespace === Namespace.DISCORD);
        assert(channel.serverId.namespace === Namespace.DISCORD);
        const guild = this.client.guilds.resolve(channel.serverId.value);
        const member = guild.member(user.id.value);
        return member.hasPermission('KICK_MEMBERS', { checkAdmin: true });
    }
}