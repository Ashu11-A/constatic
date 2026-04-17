import { RoleSelectMenuBuilder, type CacheType, type RoleSelectMenuComponentData } from "discord.js";
import { ResponderType } from "../../types/responder.js";
import type { RoleSelectData } from "../../types/actions.js";
import { BaseAction } from "./base.js";

export type GenericRoleSelect = RoleSelect<any, any>

export class RoleSelect<
    const Parse extends string,
    const Cache extends CacheType = 'cached'
> extends BaseAction<Parse, Cache, RoleSelectMenuBuilder, RoleSelectData<Parse, Cache>> {
    public readonly type = ResponderType.RoleSelect;
    protected builder: RoleSelectMenuBuilder;

    get run() { return this.options.onSelect }

    constructor(options: RoleSelectData<Parse, Cache>) {
        super(options);
        this.builder = new RoleSelectMenuBuilder(options as Partial<RoleSelectMenuComponentData>);
    }
}
