import { UserSelectMenuBuilder, type CacheType, type UserSelectMenuComponentData } from "discord.js";
import type { Analyze, ParsePath } from "url-ast";
import { ResponderType, type ResponderData, type ResponderInteraction } from "../../types/responder.js";
import { Responder } from "../responders/responder.js";
import { buildCustomId } from "./utils.js";

export type GenericUserSelect = UserSelect<any, CacheType>

type UserSelectData<Parse extends string, Cache extends CacheType> = {
    cache?: Cache
    parser: Parse
    onSelect: (
        this: ResponderData<Parse, [ResponderType.UserSelect], Cache>,
        interaction: ResponderInteraction<ResponderType.UserSelect, Cache>,
        params: ParsePath<Parse>['fragment'] & ParsePath<Parse>['params'] & ParsePath<Parse>['searchParams']
    ) => Promise<void>
} & Omit<Partial<UserSelectMenuComponentData>, 'customId' | 'custom_id'>

export class UserSelect<
    const Parse extends string,
    const Cache extends CacheType = 'cached'
> {
    public readonly type = ResponderType.UserSelect;
    public responder!: Responder<any, any, any>
    private builder: UserSelectMenuBuilder;
    public ast: Analyze<Parse> = {} as Analyze<Parse>

    get run() { return this.options.onSelect }

    constructor(public options: UserSelectData<Parse, Cache>) {
        this.builder = new UserSelectMenuBuilder(options as Partial<UserSelectMenuComponentData>);
    }

    toComponentData(params: ParsePath<Parse>['params'], query?: ParsePath<Parse>['searchParams']): UserSelectMenuBuilder {
        this.builder.setCustomId(buildCustomId(this.ast, params, query));
        return this.builder;
    }
}
