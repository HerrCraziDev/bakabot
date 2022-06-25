
import { Guild, GuildMember, Message, MessageEvent, Snowflake, User } from 'discord.js';
import { user_id, guild_id } from '../../config.json';
import { Baka } from '../Baka';
import { BaseModule } from '../Module';

export class TimeUpdater extends BaseModule {
    readonly mod_name: string = "TimeUpdater";
    readonly mod_desc: string = "Good Heavens, look at the stev!";

    client: Baka
    guild: Guild
    user: GuildMember

    private _timeout: NodeJS.Timeout
    private _initialName: string;

    constructor(client: Baka) {
        super("TimeUpdater", client);

        this.client.on('ready', () => { this.init(guild_id, user_id) });
        this.client.on('messageCreate', (message) => this.respond(message) );
    }

    protected async init(guild_id: Snowflake, user_id: Snowflake) {
        try {
            this.guild = await this.client.guilds.fetch(guild_id);
            this.logger.log(`Guild found : ${this.guild.name}@${this.guild.id}`);
            
            
            this.user = await this.guild.members.fetch(user_id);
            this._initialName = this.user.nickname;
            this.logger.log(`User found : ${this.user.user.username}`);
        } catch (e) {
            this.logger.error("Couldn't find guild or user.");
            throw e;
        }

        if (this.guild && this.user) {
            this.run()
            this.onTheMinute();
        }
    }

    public async run() {
        let date = new Date();
        // this.logger.log(this)

        try {
            await this.user.setNickname(`${date.getHours().toString().padStart(2, '0')} : ${date.getMinutes().toString().padStart(2, '0')}`);
            this.logger.log(`Updated to ${date.getHours().toString().padStart(2,'0')} : ${date.getMinutes().toString().padStart(2,'0')}`);
        } catch (e) {
            this.logger.error("Couldn't update user.");
            this.logger.error(e);
        }
    }

    public async stop() {
        clearTimeout(this._timeout);
        await this.user.setNickname(this._initialName);
        return true;
    }

    private async respond(message: Message) {
        // this.logger.log(message.mentions);
        
        if ( message.mentions.has(this.client.user.id, {ignoreEveryone: true, ignoreRoles: true}) ) {
            await message.reply(`:clock1: Téma le stev <@${this.user.id}>`);
            this.logger.log("Baka !");
        }
    }
    
    private onTheMinute() {
        const remaining = 60000 - (Date.now() % 60000);
        this._timeout = setTimeout(() => {
            this.run();
            this.onTheMinute();
        }, remaining + (remaining < 50 ? 60000 : 0));
    }
}
