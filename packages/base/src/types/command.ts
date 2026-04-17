import { ApplicationCommandOptionType, ApplicationCommandType, AutocompleteInteraction, ChatInputCommandInteraction, InteractionContextType, MessageContextMenuCommandInteraction, UserContextMenuCommandInteraction, type ApplicationCommandOptionAllowedChannelTypes, type ApplicationCommandOptionChoiceData, type BaseApplicationCommandData, type CacheType, type ChatInputApplicationCommandData, type LocalizationMap, type MessageApplicationCommandData, type UserApplicationCommandData } from "discord.js"
import type { GenericAction } from "../creators/actions/index.js"
import type { NotEmptyArray, UniqueArray } from "./utils.js"

export type CommandType = 
    | ApplicationCommandType.ChatInput
    | ApplicationCommandType.Message
    | ApplicationCommandType.User

type AutocompleData<Type> = Promise<
    | readonly ApplicationCommandOptionChoiceData<
        Type extends (number | string) ? Type : (number | string)
    >[]
    | undefined
    | void
>

export type AutocompleteRun<Type, Contexts> = (
    this: void,
    interaction: AutocompleteInteraction<CacheMode<Contexts>>
) => AutocompleData<Type>

interface AutocompleteOptionData<Type, Contexts> {
    autocomplete?: true | AutocompleteRun<Type, Contexts>
}

interface BaseOptionData {
    name: string
    nameLocalizations?: LocalizationMap
    description?: string
    descriptionLocalizations?: LocalizationMap
    required?: boolean
}

interface StringOptionData<Contexts> extends
    BaseOptionData, AutocompleteOptionData<string, Contexts> {
    type: ApplicationCommandOptionType.String,
    choices?: readonly ApplicationCommandOptionChoiceData<string>[]
    minLength?: number
    maxLength?: number
}

interface NumberOptionData<Contexts> extends
    BaseOptionData, AutocompleteOptionData<number, Contexts> {
    type:
    | ApplicationCommandOptionType.Number
    | ApplicationCommandOptionType.Integer
    choices?: readonly ApplicationCommandOptionChoiceData<number>[]
    minValue?: number
    maxValue?: number
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
    | ChannelOptionData

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
    : CacheType

interface CommandBase {
  block(): never
}

export type CommandRunThis<Actions> = CommandBase & {
  [ActionKey in keyof Actions]: Actions[ActionKey] extends { toComponentData: infer ComponentData }
    ? ComponentData
    : never
}

type ResolveCommandModuleData<Return> = Return extends void ? undefined : Return

export type SubCommandModuleData<Contexts, Actions, Return> =
    Omit<BaseOptionData, "required"> & {
        group?: string
        run(
            this: CommandRunThis<Actions>,
            interaction: ChatInputCommandInteraction<CacheMode<Contexts>>,
            data: ResolveCommandModuleData<Return>
        ): Promise<void>
        options?: SlashCommandPrimitiveOptionData<Contexts>[]
    }

export type SubCommandGroupModuleData<Contexts, Actions, Return, T> =
    Omit<BaseOptionData, "required"> & {
        options?: Omit<SubCommandOptionData<Contexts>, "type">[]
        run?(
            this: CommandRunThis<Actions>,
            interaction: ChatInputCommandInteraction<CacheMode<Contexts>>,
            data: ResolveCommandModuleData<Return>
        ): Promise<T>
    }

type RunInteraction<T, Contexts> =
    T extends ApplicationCommandType.Message
    ? MessageContextMenuCommandInteraction<CacheMode<Contexts>> :
    T extends ApplicationCommandType.User
    ? UserContextMenuCommandInteraction<CacheMode<Contexts>> :
    ChatInputCommandInteraction<CacheMode<Contexts>>

type BaseAppCommandData =
    & Omit<BaseApplicationCommandData, "contexts">
    & Pick<BaseOptionData, "descriptionLocalizations">

export interface CommandData<T, Contexts, Actions extends Record<string, GenericAction>, R> extends BaseAppCommandData {
    name: string
    description?: string
    contexts?: NotEmptyArray<UniqueArray<Contexts>>
    type?: T
    actions: Actions
    global?: boolean
    run?(this: CommandRunThis<Actions>, interaction: RunInteraction<T, Contexts>): Promise<R>
    autocomplete?: AutocompleteRun<string | number, Contexts>
    options?:
    | SlashCommandPrimitiveOptionData<Contexts>[]
    | (GroupOptionData<Contexts> | SubCommandOptionData<Contexts>)[]
}

export type SlashCommandOptionData<Contexts> =
    | SlashCommandPrimitiveOptionData<Contexts>
    | GroupOptionData<Contexts>
    | SubCommandOptionData<Contexts>

export type CommandModule =
    | (SubCommandGroupModuleData<unknown, unknown, unknown, unknown> & {
        type: ApplicationCommandOptionType.SubcommandGroup
    })
    | (SubCommandModuleData<unknown, unknown, unknown> & {
        type: ApplicationCommandOptionType.Subcommand
        group?: string
    })

export type BuildedCommandData = (
    | UserApplicationCommandData
    | MessageApplicationCommandData
    | ChatInputApplicationCommandData
) & { global?: boolean }