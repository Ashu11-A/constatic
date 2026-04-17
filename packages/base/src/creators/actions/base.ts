import type { CacheType } from "discord.js";
import type { Analyze, ParsePath } from "url-ast";
import type { ResponderType } from "../../types/responder.js";
import type { ActionBaseData, ActionHandler } from "../../types/actions.js";
import type { Responder } from "../responders/responder.js";
import { buildCustomId } from "./utils.js";

export abstract class BaseAction<
    const Parse extends string,
    const Cache extends CacheType,
    TBuilder extends { setCustomId(customId: string): unknown },
    TOptions extends ActionBaseData<Parse, Cache>
> {
    public abstract readonly type: ResponderType;
    public responder!: Responder<any, any, any>;
    public ast: Analyze<Parse> = {} as Analyze<Parse>;
    protected abstract builder: TBuilder;
    abstract get run(): ActionHandler<Parse, any, Cache>;

    constructor(public options: TOptions) {}

    toComponentData(params: ParsePath<Parse>['params'], query?: ParsePath<Parse>['searchParams']): TBuilder {
        this.builder.setCustomId(buildCustomId(this.ast, params, query));
        return this.builder;
    }
}
