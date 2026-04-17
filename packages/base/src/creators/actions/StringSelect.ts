import { StringSelectMenuBuilder, type CacheType, type StringSelectMenuComponentData } from "discord.js";
import type { Analyze, ParsePath } from "url-ast";
import { ResponderType, type ResponderData, type ResponderInteraction } from "../../types/responder.js";
import { Responder } from "../responders/responder.js";
import { buildCustomId } from "./utils.js";

export type GenericStringSelect = StringSelect<any, CacheType>

type StringSelectData<Parse extends string, Cache extends CacheType> = {
    cache?: Cache
    parser: Parse
    onSelect: (
        this: ResponderData<Parse, [ResponderType.StringSelect], Cache>,
        interaction: ResponderInteraction<ResponderType.StringSelect, Cache>,
        params: ParsePath<Parse>['fragment'] & ParsePath<Parse>['params'] & ParsePath<Parse>['searchParams']
    ) => Promise<void>
} & Omit<Partial<StringSelectMenuComponentData>, 'customId' | 'custom_id'>

export class StringSelect<
    const Parse extends string,
    const Cache extends CacheType = 'cached'
> {
    public readonly type = ResponderType.StringSelect;
    public responder!: Responder<any, any, any>
    private builder: StringSelectMenuBuilder;
    public ast: Analyze<Parse> = {} as Analyze<Parse>

    get run() { return this.options.onSelect }

    constructor(public options: StringSelectData<Parse, Cache>) {
        this.builder = new StringSelectMenuBuilder(options as Partial<StringSelectMenuComponentData>);
    }

    toComponentData(params: ParsePath<Parse>['params'], query?: ParsePath<Parse>['searchParams']): StringSelectMenuBuilder {
        this.builder.setCustomId(buildCustomId(this.ast, params, query));
        return this.builder;
    }
}
