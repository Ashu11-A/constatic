import { ApplicationCommandOptionType, ApplicationCommandType, AutocompleteInteraction, ChatInputCommandInteraction, InteractionContextType, MessageContextMenuCommandInteraction, UserContextMenuCommandInteraction, type ApplicationCommandOptionAllowedChannelTypes, type ApplicationCommandOptionChoiceData, type BaseApplicationCommandData, type CacheType, type LocalizationMap } from "discord.js";
import { type ChatInputApplicationCommandData, type MessageApplicationCommandData, type UserApplicationCommandData } from "discord.js";
import type { NotEmptyArray, UniqueArray } from "./utils.js";

export type CommandType = 
    | ApplicationCommandType.ChatInput
    | ApplicationCommandType.Message
    | ApplicationCommandType.User;

type AutocompleData<Type> = Promise<
    | readonly ApplicationCommandOptionChoiceData<
        Type extends (number | string) ? Type : (number | string)
    >[]
    | undefined
    | void
>;

export type AutocompleteRun<Type, Contexts> = (
    this: void,
    interaction: AutocompleteInteraction<CacheMode<Contexts>>
) => AutocompleData<Type>;

interface AutocompleteOptionData<Type, Contexts> {
    autocomplete?: true | AutocompleteRun<Type, Contexts>;
}

interface BaseOptionData {
    name: string;
    nameLocalizations?: LocalizationMap;
    description?: string;
    descriptionLocalizations?: LocalizationMap;
    required?: boolean;
}

interface StringOptionData<Contexts> extends
    BaseOptionData, AutocompleteOptionData<string, Contexts> {
    type: ApplicationCommandOptionType.String,
    choices?: readonly ApplicationCommandOptionChoiceData<string>[];
    minLength?: number;
    maxLength?: number;
}

interface NumberOptionData<Contexts> extends
    BaseOptionData, AutocompleteOptionData<number, Contexts> {
    type:
    | ApplicationCommandOptionType.Number
    | ApplicationCommandOptionType.Integer;
    choices?: readonly ApplicationCommandOptionChoiceData<number>[];
    minValue?: number;
    maxValue?: number;
}

interface ChannelOptionData extends BaseOptionData {
    type: ApplicationCommandOptionType.Channel
    channelTypes?: readonly ApplicationCommandOptionAllowedChannelTypes[]
}
interface CommonOptionData extends BaseOptionData {
    type:
    | ApplicationCommandOptionType.Attachment
    | ApplicationCommandOptionType.Boolean
    | ApplicationCommandOptionType.Mentionable
    | ApplicationCommandOptionType.Role
    | ApplicationCommandOptionType.User
}

export type SlashCommandPrimitiveOptionData<Contexts> =
    | StringOptionData<Contexts>
    | NumberOptionData<Contexts>
    | CommonOptionData
    | ChannelOptionData;

export interface SubCommandOptionData<Contexts> extends Omit<BaseOptionData, "required"> {
    type: ApplicationCommandOptionType.Subcommand,
    options?: SlashCommandPrimitiveOptionData<Contexts>[]
}

export interface GroupOptionData<Contexts> extends Omit<BaseOptionData, "required"> {
    type: ApplicationCommandOptionType.SubcommandGroup,
    options: SubCommandOptionData<Contexts>[]
}

type CacheMode<Contexts> = Contexts extends readonly InteractionContextType[]
    ? {
        [InteractionContextType.Guild]: "cached",
        [InteractionContextType.BotDM]: CacheType,
        [InteractionContextType.PrivateChannel]: CacheType,
    }[Contexts[number]]
    : CacheType;

interface CommandRunThis {
    /**
     * Blocks the flow of executions
     */
    block(): never;
}

type ResolveCommandModuleData<Return> = Return extends void ? undefined : Return;

export type SubCommandModuleData<Contexts, Return> =
    Omit<BaseOptionData, "required"> & {
        group?: string;
        run(
            this: CommandRunThis,
            interaction: ChatInputCommandInteraction<CacheMode<Contexts>>,
            data: ResolveCommandModuleData<Return>
        ): Promise<void>;
        options?: SlashCommandPrimitiveOptionData<Contexts>[]
    };

export type SubCommandGroupModuleData<Contexts, Return, T> =
    Omit<BaseOptionData, "required"> & {
        options?: Omit<SubCommandOptionData<Contexts>, "type">[]
        run?(
            this: CommandRunThis,
            interaction: ChatInputCommandInteraction<CacheMode<Contexts>>,
            data: ResolveCommandModuleData<Return>
        ): Promise<T>;
    };

type RunInteraction<T, Contexts> =
    T extends ApplicationCommandType.Message
    ? MessageContextMenuCommandInteraction<CacheMode<Contexts>> :
    T extends ApplicationCommandType.User
    ? UserContextMenuCommandInteraction<CacheMode<Contexts>> :
    ChatInputCommandInteraction<CacheMode<Contexts>>

type BaseAppCommandData =
    & Omit<BaseApplicationCommandData, "contexts">
    & Pick<BaseOptionData, "descriptionLocalizations">

export interface CommandData<T, Contexts, R> extends BaseAppCommandData {
    name: string;
    description?: string;
    contexts?: NotEmptyArray<UniqueArray<Contexts>>
    type?: T;
    global?: boolean;
    run?(this: CommandRunThis, interaction: RunInteraction<T, Contexts>): Promise<R>;
    autocomplete?: AutocompleteRun<string | number, Contexts>;
    options?:
    | SlashCommandPrimitiveOptionData<Contexts>[]
    | (GroupOptionData<Contexts> | SubCommandOptionData<Contexts>)[];
}

export type SlashCommandOptionData<Contexts> =
    | SlashCommandPrimitiveOptionData<Contexts>
    | GroupOptionData<Contexts>
    | SubCommandOptionData<Contexts>

export type CommandModule =
    | (SubCommandGroupModuleData<unknown, unknown, unknown> & {
        type: ApplicationCommandOptionType.SubcommandGroup
    })
    | (SubCommandModuleData<unknown, unknown> & {
        type: ApplicationCommandOptionType.Subcommand
        group?: string
    });

export type BuildedCommandData = (
    | UserApplicationCommandData
    | MessageApplicationCommandData
    | ChatInputApplicationCommandData
) & { global?: boolean };