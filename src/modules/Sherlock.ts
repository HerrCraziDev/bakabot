import { BaseClient, Message, User } from "discord.js";
import { Baka } from "../Baka";
import { BaseModule } from "../Module";
import { REST } from "@discordjs/rest";
import { Routes } from 'discord-api-types/v10';


export class Sherlock extends BaseModule {
    readonly mod_name: string = "Sherlock";
    readonly mod_desc: string = "API forensics utilities";

    constructor(client: Baka) {
        super("Sherlock", client);
    }
    
    public async init() {
        this.client.commands.register("userfetch", (message) => this.userfetch(message));
        this.client.commands.register("aff", (message) => this.affinities(message));
    }

    public async run() {
        this.logger.log("My name is, as always, Schlock");
    }

    public async stop() {
        return true;
    }

    private async userfetch(message: Message) {
        let uid = message.content.split(" ")[1];
        let user: User;
        if (uid) {
            user = await this.client.users.fetch(uid);
            if (user) {
                message.reply({
                    embeds: [{
                        title: `User: ${user.username} - SHLK`,
                        description: `Basic user data for \`${user.tag}\``,
                        thumbnail: { url: user.displayAvatarURL() },
                        color: 0x66aa00,
                        timestamp: new Date(),
                        footer: {
                            text: `${this.client.user.username}::${this.mod_name}`,
                            icon_url: this.client.user.displayAvatarURL()
                        }
                    }]
                })
            } else {
                throw new Error(`No user found matching id \`${uid}\``);
            }
        } else {
            throw new Error("Usage: !userfetch <user.id>");
        }
    }

    private async affinities(message: Message) {
        let uid;
        if (message.mentions.users.size > 0) {
            uid = message.mentions.users?.first()?.id;
        } else {
            uid = message.content.split(" ")[1];
        }

        if (!uid) throw new Error("Usage: !aff <user.id>");

        // type C = Omit<Baka, 'rest'> & {rest: REST}
        // let c = this.client as unknown as C;
        let aff = await this.client._rest.get(`${Routes.user(uid)}/affinities/users`);
        this.logger.log("aff: %j", aff);
    }
}