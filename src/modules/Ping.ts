import { Message } from "discord.js";
import { Baka } from "../Baka";
import { BaseModule } from "../Module";


export class Ping extends BaseModule {
    readonly mod_name: string = "Ping";
    readonly mod_desc: string = "Basic baka printer";

    constructor(client: Baka) {
        super("Ping", client);
    }
    
    public async init() {
        this.client.commands.register("ping", (message) => this.ping(message));
    }

    public async run() {
        this.logger.log("Ping ready, baka!");
    }

    public async stop() {
        return true;
    }

    private async ping(message: Message) {
        await message.reply(`Baka! \`g:${message.guildId} c:${message.channelId} t:${message.channel.isThread()}\``);
        this.logger.log(`Baka! g:${message.guildId} c:${message.channelId} t:${message.channel.isThread()}`);
    }
}