import { MentionableSelectMenuBuilder, type CacheType, type MentionableSelectMenuComponentData } from "discord.js";
import type { Analyze, ParsePath } from "url-ast";
import { ResponderType, type ResponderData, type ResponderInteraction } from "../../types/responder.js";
import { Responder } from "../responders/responder.js";
import { buildCustomId } from "./utils.js";

export type GenericMentionableSelect = MentionableSelect<any, CacheType>

type MentionableSelectData<Parse extends string, Cache extends CacheType> = {
    cache?: Cache
    parser: Parse
    onSelect: (
        this: ResponderData<Parse, [ResponderType.MentionableSelect], Cache>,
        interaction: ResponderInteraction<ResponderType.MentionableSelect, Cache>,
        params: ParsePath<Parse>['fragment'] & ParsePath<Parse>['params'] & ParsePath<Parse>['searchParams']
    ) => Promise<void>
} & Omit<Partial<MentionableSelectMenuComponentData>, 'customId' | 'custom_id'>

export class MentionableSelect<
    const Parse extends string,
    const Cache extends CacheType = 'cached'
> {
    public readonly type = ResponderType.MentionableSelect;
    public responder!: Responder<any, any, any>
    private builder: MentionableSelectMenuBuilder;
    public ast: Analyze<Parse> = {} as Analyze<Parse>

    get run() { return this.options.onSelect }

    constructor(public options: MentionableSelectData<Parse, Cache>) {
        this.builder = new MentionableSelectMenuBuilder(options as Partial<MentionableSelectMenuComponentData>);
    }

    toComponentData(params: ParsePath<Parse>['params'], query?: ParsePath<Parse>['searchParams']): MentionableSelectMenuBuilder {
        this.builder.setCustomId(buildCustomId(this.ast, params, query));
        return this.builder;
    }
}
