import { Baka } from "../Baka";
import { BaseModule } from "../Module";


export class ExampleModule extends BaseModule {
    public readonly mod_name: string = "ExampleModule";
    public readonly mod_desc: string = "Example module";

    constructor(client: Baka) {
        super("ExampleModule", client);

        // Early hooks (like 'ready') goes here
    }

    public async init() {
        // Async initialization goes here. (IO, requests, etc) This runs before 'ready'
    }

    public async run() {
        // What do, Sir?
    }

    public async stop() {
        // Cleaning goes here
        return true;
    }
}