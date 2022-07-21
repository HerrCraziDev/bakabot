import { Collection, Guild, Message, MessageOptions, MessagePayload, Snowflake, TextChannel } from "discord.js";
import { Baka } from "../Baka";
import { BaseModule } from "../Module";
import * as fs from 'fs';
import { throttle } from "../Utils";

const config = {
    channel: "999240594247401492",
    guild: "388093770585079809",
    lb_chan: "999604019280498758",
    lb_guild: "388093770585079809",
    lb_snowflake: "./data/Leaderboard/lb_snowflake",
    expr: "👋"
}

export class Leaderboard extends BaseModule {
    public readonly mod_name: string = "Leaderboard";
    public readonly mod_desc: string = "Basic leaderboard counting :wave: in a channel";

    private channel: TextChannel;
    private guild: Guild;
    private lb_chan: TextChannel;
    private lb_guild: Guild;

    private scores: Map<Snowflake,number>;

    constructor(client: Baka) {
        super("Leaderboard", client);
        this.scores = new Map();

        this.client.on("ready", () => this.run())
    }

    public async init() {
        // Async initialization goes here. (IO, requests, etc) This runs before 'ready'
    }

    public async run() {
        await this.fetchAllMessages();
        await this.updateLeaderboard();
        this.setupTimers();
    }

    public async stop() {
        // Cleaning goes here
        return true;
    }

    private async fetchAllMessages() {
        // Fetch channels
        this.channel = await this.client.channels.fetch(config.channel) as TextChannel;
        this.lb_chan = await this.client.channels.fetch(config.lb_chan) as TextChannel;

        // Fetch all messages in target channel
        this.logger.log(`Found channel ${this.channel.name}`);
        let messagesPart: Collection<string, Message> = await this.channel.messages.fetch({ limit: 100 });
        let messages: Collection<string, Message> = messagesPart;
        let lastkey: Snowflake;

        do {
            messagesPart = await this.channel.messages.fetch({ limit: 100, before: messagesPart.lastKey() });
            messages = messages.concat(messagesPart);
            this.logger.log(`Fetched ${messages.size} messages (+${messagesPart.size}) from ${messagesPart.first()?.createdAt.toUTCString()} to ${messagesPart.last()?.createdAt.toUTCString()}`);
        } while (messagesPart.size == 100 && !this.client.quitting);

        this.logger.log(`${messages.size} messages fetched!`);

        // Count matches (scores) per user
        for (const [_, message] of messages) {
            let _match = message.content.match(config.expr);
            if (_match) {
                let prev = this.scores.get(message.author.id) ?? 0;
                this.scores.set(message.author.id, prev + 1);
            }
        }

        this.logger.log(`Tracking scores for ${this.scores.size} users`);
        for (const [user, score] of this.scores) {
            this.logger.debug(`${user}: ${score}`);
        }
    }

    private async updateLeaderboard() {
        this.logger.debug("Updating...")
        let leaderboard = await this.getLeaderboard();
        let sorted_scores = [...this.scores].sort((a, b) => b[1] - a[1]);

        let fields = [];
        for (const [uid, score] of sorted_scores) {
            fields.push({
                name: (await this.client.users.fetch(uid))?.username ?? "DeletedUser",
                value: `${score}:wave:`,
                inline: true
            });
        }

        let lb_contents: MessageOptions = {
            embeds: [{
                title: `:wave: Top Coucou :wave:`,
                description: `Meilleurs agents du chaos.\n*En partenariat avec le [Gouvernement Indien](https://youtu.be/vTIIMJ9tUc8?t=102), l'[élite de la nation](https://www.facebook.com/messages/t/1679521542131560) et le [Saint Spam](https://www.spam.com/varieties/spam-classic)*`,
                thumbnail: { url: 'https://media.discordapp.net/attachments/410964674520154112/999294128321990686/baka.png' },
                color: 0xffaa00,
                fields: fields,
                footer: {
                    text: this.client.user.username,
                    icon_url: this.client.user.displayAvatarURL()
                }
            }]
        };

        if (!leaderboard) {
            leaderboard = await this.lb_chan.send(lb_contents);
            this.saveLeaderboard(leaderboard);
            this.logger.log(`Initial leaderboard created`);
        } else {
            await leaderboard.edit(lb_contents);
            this.logger.log(`Leaderboard updated`)
        }

    }

    private async getLeaderboard() : Promise<Message> {
        let lbid: string;
        try {
            lbid = fs.readFileSync(config.lb_snowflake).toString().trim();

            if (!lbid) return;
            else return await this.lb_chan.messages.fetch(lbid, {force: true});
        } catch (error) {
            return;
        }
    }

    private saveLeaderboard(leaderboard: Message) {
        fs.writeFileSync(config.lb_snowflake, leaderboard.id);
    }

    private setupTimers() {
        const throttled_update = throttle(() => this.logger.log("Update triggered"), 2000);
        this.client.on("messageCreate", (message) => {
            this.logger.debug(message.content);
            if (message.channel.id === this.channel.id && !message.author.bot && message.content.match(config.expr)) {
                let prev = this.scores.get(message.author.id) ?? 0;
                this.scores.set(message.author.id, prev++);
                this.logger.debug("Matched")
                throttled_update();
            }
        })
    }
}