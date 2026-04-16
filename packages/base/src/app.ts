import { version as djsVersion } from "discord.js";
import { styleText } from "node:util";
import { CommandManager } from "./creators/commands/manager.js";
import { EventManager } from "./creators/events/manager.js";
import { ResponderManager } from "./creators/responders/manager.js";
import { baseErrorHandler } from "./error.js";
import { version } from "./version.js";
import type { BaseConfig, BaseErrorHandler, SetupCreatorsOptions } from "./types/instance.js";

declare const Bun: { version: string };
const isBun = typeof Bun !== "undefined";

export class ConstaticApp {
    readonly commands = new CommandManager(this);
    readonly responders = new ResponderManager(this);
    readonly events = new EventManager(this);
    public readonly config: BaseConfig;
    private static "~instance": ConstaticApp | null = null;
    static getInstance() {
        return this["~instance"] ??= new ConstaticApp();
    }
    private constructor() {
        this.config = {
            commands: {},
            responders: {},
            events: {},
            errorHandler: baseErrorHandler,
        }
    }
    public static destroy() {
        this["~instance"] = null;
    }
    public setErrorHandler(handler: BaseErrorHandler) {
        this.config.errorHandler = handler;
    }
    public intro() {
        console.log();
        console.log("%s %s",
            styleText("blue", "★ Constatic Base"),
            styleText("dim", version),
        );
        console.log("%s %s | %s %s",
            styleText("blueBright", "◌ discord.js"),
            styleText("dim", djsVersion),
            isBun ? "◌ Bun" : styleText("green", "⬢ Node.js"),
            styleText("dim", isBun ? Bun.version : process.versions.node)
        );
        console.log();
    }
    public printLogs() {
        console.log([
            ...this.commands.logs,
            ...this.responders.logs,
            ...this.events.logs,
        ].join("\n"));
    }

    static config(options: SetupCreatorsOptions) {
        const app = ConstaticApp.getInstance();
        app.config.commands = { ...options.commands ??= {} };
        app.config.commands.guilds ??= [];
        app.config.responders = { ...options.responders ??= {} };
        app.config.events = { ...options.events ??= {} };

        if (process.env.GUILD_ID?.length) {
            app.config.commands.guilds.push(
                process.env.GUILD_ID
            );
        }
    }
}