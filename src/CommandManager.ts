import { Collection, Message } from "discord.js";

export type BakaCommand = (message: Message) => void;

export class CommandManager {
    private commands: Collection<string, BakaCommand>;

    constructor() {
        this.commands = new Collection();
    }

    public register(trigger: string, action: BakaCommand): boolean {
        if (!trigger || !action || this.commands.has(trigger)) return false;

        this.commands.set(trigger, action);
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

    public has(name: string): boolean {
        return this.commands.has(name);
    }

    public get(name: string): BakaCommand {
        return this.commands.get(name);
    }
}