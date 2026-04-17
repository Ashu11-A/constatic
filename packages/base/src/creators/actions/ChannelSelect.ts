import { ChannelSelectMenuBuilder, type CacheType, type ChannelSelectMenuComponentData } from "discord.js";
import type { Analyze, ParsePath } from "url-ast";
import { ResponderType, type ResponderData, type ResponderInteraction } from "../../types/responder.js";
import { Responder } from "../responders/responder.js";
import { buildCustomId } from "./utils.js";

export type GenericChannelSelect = ChannelSelect<any, CacheType>

type ChannelSelectData<Parse extends string, Cache extends CacheType> = {
    cache?: Cache
    parser: Parse
    onSelect: (
        this: ResponderData<Parse, [ResponderType.ChannelSelect], Cache>,
        interaction: ResponderInteraction<ResponderType.ChannelSelect, Cache>,
        params: ParsePath<Parse>['fragment'] & ParsePath<Parse>['params'] & ParsePath<Parse>['searchParams']
    ) => Promise<void>
} & Omit<Partial<ChannelSelectMenuComponentData>, 'customId' | 'custom_id'>

export class ChannelSelect<
    const Parse extends string,
    const Cache extends CacheType = 'cached'
> {
    public readonly type = ResponderType.ChannelSelect;
    public responder!: Responder<any, any, any>
    private builder: ChannelSelectMenuBuilder;
    public ast: Analyze<Parse> = {} as Analyze<Parse>

    get run() { return this.options.onSelect }

    constructor(public options: ChannelSelectData<Parse, Cache>) {
        this.builder = new ChannelSelectMenuBuilder(options as Partial<ChannelSelectMenuComponentData>);
    }

    toComponentData(params: ParsePath<Parse>['params'], query?: ParsePath<Parse>['searchParams']): ChannelSelectMenuBuilder {
        this.builder.setCustomId(buildCustomId(this.ast, params, query));
        return this.builder;
    }
}
