import { Baka } from "./Baka";
import { Logger } from "./Logger";

export interface Module {
    readonly mod_name: string
    readonly mod_desc: string
    
    run(): Promise<any>
    stop(): Promise<boolean>
}

export abstract class BaseModule implements Module {
    readonly abstract mod_name: string
    readonly abstract mod_desc: string

    protected client: Baka
    protected logger: Logger;

    constructor(name: string, client: Baka) {
        this.client = client;
        this.logger = new Logger(name);
    }
    
    // abstract init(): Promise<any>
    public abstract run(): Promise<any>
    public abstract stop(): Promise<boolean>

    // public get name(): string {
    //     return this.name;
    // }
}