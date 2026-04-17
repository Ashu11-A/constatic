import { UserSelectMenuBuilder, type CacheType, type UserSelectMenuComponentData } from "discord.js";
import { ResponderType } from "../../types/responder.js";
import type { UserSelectData } from "../../types/actions.js";
import { BaseAction } from "./base.js";

export type GenericUserSelect = UserSelect<any, any>

export class UserSelect<
    const Parse extends string,
    const Cache extends CacheType = 'cached'
> extends BaseAction<Parse, Cache, UserSelectMenuBuilder, UserSelectData<Parse, Cache>> {
    public readonly type = ResponderType.UserSelect;
    protected builder: UserSelectMenuBuilder;

    get run() { return this.options.onSelect }

    constructor(options: UserSelectData<Parse, Cache>) {
        super(options);
        this.builder = new UserSelectMenuBuilder(options as Partial<UserSelectMenuComponentData>);
    }
}
