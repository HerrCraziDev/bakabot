import { Message } from "discord.js";
import { Baka } from "../Baka";
import { BaseModule } from "../Module";


export class Ping extends BaseModule {
    readonly mod_name: string = "Ping";
    readonly mod_desc: string = "Basic baka printer";

    constructor(client: Baka) {
        super("Ping", client);

        client.on('messageCreate', (message) => this.respond(message));
    }

    public async run() {
        this.logger.log("Ping ready, baka!");
    }

    public async stop() {
        return true;
    }

    private async respond(message: Message) {
        // this.logger.log(message.mentions);

        if (message.mentions.has(this.client.user.id, { ignoreEveryone: true, ignoreRoles: true })) {
            await message.reply(`Baka! g:\`${message.guildId}\` c:\`${message.channelId}\` t:\`${message.channel.isThread()}\``);
            this.logger.log(`Baka! g:${message.guildId} c:${message.channelId} t:${message.channel.isThread()}`);
        }
    }
}