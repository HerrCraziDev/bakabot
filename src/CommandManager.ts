import { Collection, Message, MessageEmbed, TextChannel } from "discord.js";
import { Baka } from "./Baka";
import { Logger } from "./Logger";

export type BakaCommand = (message: Message) => void;

export class CommandManager {
    private commands: Collection<string, BakaCommand>;
    private client: Baka;
    private prefix: string;
    private logger: Logger;

    constructor(client: Baka, prefix: string) {
        this.client = client;
        this.prefix = prefix;
        this.commands = new Collection();
        this.logger = new Logger("CommandManager");

        this.client.on("messageCreate", (message) => this.evaluate(message));
    }

    public register(trigger: string, action: BakaCommand): boolean {
        if (!trigger || !action || this.commands.has(trigger)) return false;

        this.commands.set(trigger, action);
        this.logger.log(`Registered command '${trigger}'`);
        return true;
    }

    public execute(name: string, message: Message) {
        this.logger.log(`Command ${name} triggered by ${message.author.username} in ${(message.channel as TextChannel).name}`);

        // Perfectly condensed efficient codechad (just say 'no' to JS optimizations) *leaves stack*
        return ( this.commands.get(name) ?? (() => { throw new Error(`No command matching '${name}'.`); }) )(message);

        // Virgin multiline verbous bloat
        let command = this.commands.get(name);
        if (command) {
            return command(message);
        } else {
            throw new Error(`No command matching '${name}'.`);
        }
    }

    private evaluate(message: Message) {
        if ( !message.author.bot && (message.mentions.has(this.client.user.id, { ignoreEveryone: true, ignoreRoles: true }) || message.content?.startsWith(this.prefix)) ) {
            let name: string;
            if (message.content?.startsWith(this.prefix)) {
                name = message.content.substring(1).split(/\s+/)[0];
            } else {
                name = message.content.split(/\s+/)[1];
            }

            if (!name) return;

            try {
                this.execute(name, message);
            } catch (error) {
                this.logger.error(error);
                message.reply({
                    embeds: [
                        {
                            title: "Baka !",
                            thumbnail: { url: 'https://media.discordapp.net/attachments/410964674520154112/999294128321990686/baka.png' },
                            color: 0xff0000,
                            description: error.toString(),
                        }
                    ]
                });
            }
        }
    }

    public has(name: string): boolean {
        return this.commands.has(name);
    }

    public get(name: string): BakaCommand {
        return this.commands.get(name);
    }
}
