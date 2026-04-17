import { ChannelSelectMenuBuilder, type CacheType, type ChannelSelectMenuComponentData } from "discord.js";
import { ResponderType } from "../../types/responder.js";
import type { ChannelSelectData } from "../../types/actions.js";
import { BaseAction } from "./base.js";

export type GenericChannelSelect = ChannelSelect<any, CacheType>

export class ChannelSelect<
    const Parse extends string,
    const Cache extends CacheType = 'cached'
> extends BaseAction<Parse, Cache, ChannelSelectMenuBuilder, ChannelSelectData<Parse, Cache>> {
    public readonly type = ResponderType.ChannelSelect;
    protected builder: ChannelSelectMenuBuilder;

    get run() { return this.options.onSelect }

    constructor(options: ChannelSelectData<Parse, Cache>) {
        super(options);
        this.builder = new ChannelSelectMenuBuilder(options as Partial<ChannelSelectMenuComponentData>);
    }
}
