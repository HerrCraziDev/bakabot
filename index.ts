
import { Intents } from 'discord.js';
import { Baka } from './src/Baka';

const { GUILDS, GUILD_MEMBERS, GUILD_MESSAGES} = Intents.FLAGS;

let options = {
    intents: [GUILDS, GUILD_MEMBERS, GUILD_MESSAGES]
};

let baka = new Baka(options);

baka.login();