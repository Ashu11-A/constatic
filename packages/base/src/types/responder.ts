import type { ButtonInteraction, CacheType, ChannelSelectMenuInteraction, MentionableSelectMenuInteraction, MessageComponentInteraction, ModalMessageModalSubmitInteraction, ModalSubmitInteraction, RoleSelectMenuInteraction, StringSelectMenuInteraction, UserSelectMenuInteraction } from "discord.js";
import { type ParsePath } from 'url-ast';
import type { Responder } from "../creators/index.js";
import type { NotEmptyArray, UniqueArray } from "./utils.js";

export type GenericResponder = Responder<string, readonly ResponderType[], CacheType>;

export type GenericResponderInteraction = 
    | MessageComponentInteraction
    | ModalSubmitInteraction;

export enum ResponderType {
    Button = "button",
    StringSelect = "select.string",
    UserSelect = "select.user",
    RoleSelect = "select.role",
    ChannelSelect = "select.channel",
    MentionableSelect = "select.mentionable",
    Modal = "modal",
    ModalComponent = "modal.component",
}

export type ResponderTypeKeysArray = Array<`${ResponderType}`>
export const responderKeys = Object.keys(ResponderType) as ResponderTypeKeysArray;

export type ResponderInteraction<Type extends ResponderType, Cache extends CacheType> = {
    [ResponderType.Button]: ButtonInteraction<Cache>,
    [ResponderType.StringSelect]: StringSelectMenuInteraction<Cache>,
    [ResponderType.UserSelect]: UserSelectMenuInteraction<Cache>,
    [ResponderType.RoleSelect]: RoleSelectMenuInteraction<Cache>,
    [ResponderType.ChannelSelect]: ChannelSelectMenuInteraction<Cache>,
    [ResponderType.MentionableSelect]: MentionableSelectMenuInteraction<Cache>,
    [ResponderType.Modal]: ModalSubmitInteraction<Cache>,
    [ResponderType.ModalComponent]: ModalMessageModalSubmitInteraction<Cache>,
}[Type];

export interface ResponderData<
    Path extends string,
    Types extends readonly ResponderType[],
    Cache extends CacheType,
> {
    customId: Path,
    types: NotEmptyArray<UniqueArray<Types>>,
    cache?: Cache;
    run(
        this: void,
        interaction: ResponderInteraction<Types[number], Cache>,
        params: ParsePath<Path>['fragment'] & ParsePath<Path>['params'] & ParsePath<Path>['searchParams']
    ): Promise<void>;
}