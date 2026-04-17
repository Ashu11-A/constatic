import type {
    APIButtonComponent,
    ButtonComponentData,
    CacheType,
    ChannelSelectMenuComponentData,
    MentionableSelectMenuComponentData,
    ModalComponentData,
    RoleSelectMenuComponentData,
    StringSelectMenuComponentData,
    UserSelectMenuComponentData,
} from "discord.js";
import type { ParsePath } from "url-ast";
import type { ResponderData, ResponderInteraction, ResponderType } from "./responder.js";

export type ActionHandlerParams<Parse extends string> =
    ParsePath<Parse>['fragment'] & ParsePath<Parse>['params'] & ParsePath<Parse>['searchParams'];

export type ActionHandler<Parse extends string, Type extends ResponderType, Cache extends CacheType> = (
    this: ResponderData<Parse, [Type], Cache>,
    interaction: ResponderInteraction<Type, Cache>,
    params: ActionHandlerParams<Parse>
) => Promise<void>;

export type ActionBaseData<Parse extends string, Cache extends CacheType> = {
    cache?: Cache;
    parser: Parse;
};

export type ButtonData<Parse extends string, Cache extends CacheType> =
    ActionBaseData<Parse, Cache> & {
        onClick: ActionHandler<Parse, ResponderType.Button, Cache>
    } & (Omit<Partial<ButtonComponentData>, 'customId' | 'custom_id'> | Partial<APIButtonComponent>);

export type StringSelectData<Parse extends string, Cache extends CacheType> =
    ActionBaseData<Parse, Cache> & {
        onSelect: ActionHandler<Parse, ResponderType.StringSelect, Cache>
    } & Omit<Partial<StringSelectMenuComponentData>, 'customId' | 'custom_id'>;

export type UserSelectData<Parse extends string, Cache extends CacheType> =
    ActionBaseData<Parse, Cache> & {
        onSelect: ActionHandler<Parse, ResponderType.UserSelect, Cache>
    } & Omit<Partial<UserSelectMenuComponentData>, 'customId' | 'custom_id'>;

export type RoleSelectData<Parse extends string, Cache extends CacheType> =
    ActionBaseData<Parse, Cache> & {
        onSelect: ActionHandler<Parse, ResponderType.RoleSelect, Cache>
    } & Omit<Partial<RoleSelectMenuComponentData>, 'customId' | 'custom_id'>;

export type ChannelSelectData<Parse extends string, Cache extends CacheType> =
    ActionBaseData<Parse, Cache> & {
        onSelect: ActionHandler<Parse, ResponderType.ChannelSelect, Cache>
    } & Omit<Partial<ChannelSelectMenuComponentData>, 'customId' | 'custom_id'>;

export type MentionableSelectData<Parse extends string, Cache extends CacheType> =
    ActionBaseData<Parse, Cache> & {
        onSelect: ActionHandler<Parse, ResponderType.MentionableSelect, Cache>
    } & Omit<Partial<MentionableSelectMenuComponentData>, 'customId' | 'custom_id'>;

export type ModalActionData<Parse extends string, Cache extends CacheType> =
    ActionBaseData<Parse, Cache> & {
        onSubmit: ActionHandler<Parse, ResponderType.Modal, Cache>
    } & Omit<Partial<ModalComponentData>, 'customId' | 'custom_id'>;

export type ModalComponentActionData<Parse extends string, Cache extends CacheType> =
    ActionBaseData<Parse, Cache> & {
        onSubmit: ActionHandler<Parse, ResponderType.ModalComponent, Cache>
    } & Omit<Partial<ModalComponentData>, 'customId' | 'custom_id'>;
