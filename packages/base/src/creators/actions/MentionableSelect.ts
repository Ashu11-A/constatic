import { MentionableSelectMenuBuilder, type CacheType, type MentionableSelectMenuComponentData } from "discord.js";
import { ResponderType } from "../../types/responder.js";
import type { MentionableSelectData } from "../../types/actions.js";
import { BaseAction } from "./base.js";

export type GenericMentionableSelect = MentionableSelect<any, any>

export class MentionableSelect<
    const Parse extends string,
    const Cache extends CacheType = 'cached'
> extends BaseAction<Parse, Cache, MentionableSelectMenuBuilder, MentionableSelectData<Parse, Cache>> {
    public readonly type = ResponderType.MentionableSelect;
    protected builder: MentionableSelectMenuBuilder;

    get run() { return this.options.onSelect }

    constructor(options: MentionableSelectData<Parse, Cache>) {
        super(options);
        this.builder = new MentionableSelectMenuBuilder(options as Partial<MentionableSelectMenuComponentData>);
    }
}
