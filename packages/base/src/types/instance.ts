import { Client, CommandInteraction, type PermissionResolvable } from "discord.js";
import type { GenericResponderInteraction } from "./responder.js";
import type { EventPropData } from "./event.js";

export interface BaseCommandsConfig {
    guilds?: string[];
    verbose?: boolean;
    middleware?(interaction: CommandInteraction, block: () => void): Promise<void>;
    onNotFound?(interaction: CommandInteraction): void;
    onError?(error: unknown, interaction: CommandInteraction): void;
}

export interface BaseRespondersConfig {
    middleware?(interaction: GenericResponderInteraction, block: () => void, params: object): Promise<void>;
    onNotFound?(interaction: GenericResponderInteraction): void;
    onError?(error: unknown, interaction: GenericResponderInteraction, params: object): void;
}

export interface BaseEventsConfig {
    middleware?(event: EventPropData, block: (...tags: string[]) => void): Promise<void>;
    onError?(error: unknown, event: EventPropData): void;
}

export type BaseErrorHandler = (error: Error | unknown, client: Client) => void;

export interface BaseConfig {
    commands: BaseCommandsConfig;
    events: BaseEventsConfig;
    responders: BaseRespondersConfig;
    errorHandler: BaseErrorHandler;
}

export interface SetupCreatorsOptions {
    commands?: BaseCommandsConfig & {
        defaultMemberPermissions?: PermissionResolvable[];
    };
    responders?: Partial<BaseRespondersConfig>;
    events?: Partial<BaseEventsConfig>;
}