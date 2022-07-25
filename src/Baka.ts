
import { REST } from '@discordjs/rest';
import { Client, ClientOptions, Message } from 'discord.js';
import { token, prefix } from '../config.json';
import { CommandManager } from './CommandManager';
import { Logger } from './Logger';
import { BaseModule, Module } from './Module';

import { modules } from './ModuleLoader';
import { awaitAll } from './Utils';


export class Baka extends Client {
    private modules: Array<Module> = [];
    public quitting: boolean;
    private logger: Logger = new Logger("Baka");
    public commands: CommandManager;
    public _rest: REST;

    constructor(options: ClientOptions) {
        super(options);
        this._rest = new REST({version: '10'}).setToken(token);
        this.commands = new CommandManager(this, prefix);

        for (const module of modules) {
            let mod = new module(this);
            this.modules.push(mod);
            this.logger.log(`Loaded module ${mod.mod_name}`);
        }
        
        ['beforeExit', 'SIGUSR1', 'SIGUSR2', 'SIGINT', 'SIGTERM'].map(event => process.once(event, this.exit.bind(this)));
        
        awaitAll(this.modules, (module) => module.init() );
    }

    public async login() {
        await super.login(token);
        return this.constructor.name;
    }

    public async exit() {
        if (this.quitting) return;
        this.quitting = true;

        for (const module of this.modules) {
            this.logger.log("Sent stop signal to module " + module.mod_name);
            let ret = await module.stop();
            this.logger.log(`${module.mod_name} stopped (graceful: ${ret})`);
        }

        this.destroy();
        
        this.logger.log("\x1b[95mSayonara~\x1b[0m");
    }
}