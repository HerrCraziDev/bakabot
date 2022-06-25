

export class Logger {
    private readonly classname: string;
    
    constructor(classname: string) {
        this.classname = classname;
    }

    public log(message, ...args) {
        console.log(`[\x1b[33m${this.classname}\x1b[0m] ${message}`, ...args);
    }

    public warn(message, ...args) {
        console.warn(`[\x1b[33m${this.classname}\x1b[0m] WARN ${message}`, ...args);
    }

    public error(message, ...args) {
        console.error(`[\x1b[33m${this.classname}\x1b[0m] ERR ${message}`, ...args);
    }

    public debug(message, ...args) {
        console.debug(`[\x1b[33m${this.classname}\x1b[0m] DEBUG ${message}`, ...args);
    }
}

// export function Logger<T extends { new(...args: any[]): {} }>(constructor: T) {
//     return class extends constructor {
//         logger = new BakaLogger(constructor.prototype.classname);
//     }
// }