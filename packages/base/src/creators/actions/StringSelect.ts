import { StringSelectMenuBuilder, type CacheType, type StringSelectMenuComponentData } from "discord.js";
import { ResponderType } from "../../types/responder.js";
import type { StringSelectData } from "../../types/actions.js";
import { BaseAction } from "./base.js";

export type GenericStringSelect = StringSelect<any, CacheType>

export class StringSelect<
    const Parse extends string,
    const Cache extends CacheType = 'cached'
> extends BaseAction<Parse, Cache, StringSelectMenuBuilder, StringSelectData<Parse, Cache>> {
    public readonly type = ResponderType.StringSelect;
    protected builder: StringSelectMenuBuilder;

    get run() { return this.options.onSelect }

    constructor(options: StringSelectData<Parse, Cache>) {
        super(options);
        this.builder = new StringSelectMenuBuilder(options as Partial<StringSelectMenuComponentData>);
    }
}
