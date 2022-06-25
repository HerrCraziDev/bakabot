import { Collection, Message, Snowflake, TextChannel } from "discord.js";
import { Baka } from "../Baka";
import { BaseModule } from "../Module";
import * as fs from 'fs';

const channel_id = "837121073316364340";
const guild_id = "471264108642172929";

export class VideoGrabber extends BaseModule {
    readonly mod_name: string = "VideoGrabber";
    readonly mod_desc: string = "Grabbing all youtube videos in a channel";

    constructor(client: Baka) {
        super("VideoGrabber", client);

        this.client.on('ready', () => this.run() );
    }

    public async run() {
        let channel = await this.client.channels.fetch(channel_id) as TextChannel;
        this.logger.log(`Found channel ${channel.name}`);
        let messagesPart: Collection<string, Message> = await channel.messages.fetch({ limit: 100 });
        let messages: Collection<string, Message> = messagesPart;
        let lastkey: Snowflake;

        do {
            messagesPart = await channel.messages.fetch({limit: 100, before: messagesPart.lastKey()});
            messages = messages.concat(messagesPart);
            this.logger.log(`Fetched ${messages.size} messages. (+${messagesPart.size}) from ${messagesPart.first()?.createdAt.toUTCString()} to ${messagesPart.last()?.createdAt.toUTCString()}`);
        } while (messagesPart.size == 100 && !this.client.quitting);

        this.logger.log(`${messages.size} messages fetched!`);

        let matches: Array<string> = [];
        for (const [_, message] of messages) {
            let _match = message.content.match(/https:\/\/(www.)?youtu[a-z\.]*\/[\w\-]*((\?v=|\/)([\w\-]{3,}))?([\?&]list=[\w\-]{3,})?/g);
            if (_match) { 
                matches.push(..._match);
            }
        }

        fs.writeFileSync("matches.txt", matches.join('\n'));
    }

    public async stop() {
        return true;
    }
}