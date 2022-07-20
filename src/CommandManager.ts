import { Collection, Message, MessageEmbed } from "discord.js";
import { Baka } from "./Baka";

export type BakaCommand = (message: Message) => void;

export class CommandManager {
    private commands: Collection<string, BakaCommand>;
    private client: Baka;
    private prefix: string;

    constructor(client: Baka, prefix: string) {
        this.client = client;
        this.prefix = prefix;
        this.commands = new Collection();

        this.client.on("messageCreate", this.evaluate);
    }

    public register(trigger: string, action: BakaCommand): boolean {
        if (!trigger || !action || this.commands.has(trigger)) return false;

        this.commands.set(trigger, action);
        return true;
    }

    public execute(name: string, message: Message) {

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
        if (message.mentions.has(this.client.user.id, { ignoreEveryone: true, ignoreRoles: true }) || message.content?.startsWith(this.prefix)) {
            let name: string;
            if (message.content?.startsWith(this.prefix)) {
                name = message.content.substring(1).split(" ")[0];
            } else {
                name = message.content.split(" ")[0];
            }

            try {
                this.execute(name, message);
            } catch (error) {
                message.reply({
                    embeds: [
                        {
                            title: "Baka !",
                            thumbnail: { url: 'https://media.discordapp.net/attachments/410964674520154112/999294128321990686/baka.png' },
                            color: 0xff0000,
                            description: error,
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
