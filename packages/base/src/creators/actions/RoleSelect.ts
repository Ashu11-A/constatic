import { RoleSelectMenuBuilder, type CacheType, type RoleSelectMenuComponentData } from "discord.js";
import type { Analyze, ParsePath } from "url-ast";
import { ResponderType, type ResponderData, type ResponderInteraction } from "../../types/responder.js";
import { Responder } from "../responders/responder.js";
import { buildCustomId } from "./utils.js";

export type GenericRoleSelect = RoleSelect<any, CacheType>

type RoleSelectData<Parse extends string, Cache extends CacheType> = {
    cache?: Cache
    parser: Parse
    onSelect: (
        this: ResponderData<Parse, [ResponderType.RoleSelect], Cache>,
        interaction: ResponderInteraction<ResponderType.RoleSelect, Cache>,
        params: ParsePath<Parse>['fragment'] & ParsePath<Parse>['params'] & ParsePath<Parse>['searchParams']
    ) => Promise<void>
} & Omit<Partial<RoleSelectMenuComponentData>, 'customId' | 'custom_id'>

export class RoleSelect<
    const Parse extends string,
    const Cache extends CacheType = 'cached'
> {
    public readonly type = ResponderType.RoleSelect;
    public responder!: Responder<any, any, any>
    private builder: RoleSelectMenuBuilder;
    public ast: Analyze<Parse> = {} as Analyze<Parse>

    get run() { return this.options.onSelect }

    constructor(public options: RoleSelectData<Parse, Cache>) {
        this.builder = new RoleSelectMenuBuilder(options as Partial<RoleSelectMenuComponentData>);
    }

    toComponentData(params: ParsePath<Parse>['params'], query?: ParsePath<Parse>['searchParams']): RoleSelectMenuBuilder {
        this.builder.setCustomId(buildCustomId(this.ast, params, query));
        return this.builder;
    }
}
