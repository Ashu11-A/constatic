import { ModalBuilder, type CacheType, type ModalComponentData } from "discord.js";
import type { Analyze, ParsePath } from "url-ast";
import { ResponderType, type ResponderData, type ResponderInteraction } from "../../types/responder.js";
import { Responder } from "../responders/responder.js";
import { buildCustomId } from "./utils.js";

export type GenericModal = Modal<any, CacheType>

type ModalData<Parse extends string, Cache extends CacheType> = {
    cache?: Cache
    parser: Parse
    onSubmit: (
        this: ResponderData<Parse, [ResponderType.Modal], Cache>,
        interaction: ResponderInteraction<ResponderType.Modal, Cache>,
        params: ParsePath<Parse>['fragment'] & ParsePath<Parse>['params'] & ParsePath<Parse>['searchParams']
    ) => Promise<void>
} & Omit<Partial<ModalComponentData>, 'customId' | 'custom_id'>

export class Modal<
    const Parse extends string,
    const Cache extends CacheType = 'cached'
> {
    public readonly type = ResponderType.Modal;
    public responder!: Responder<any, any, any>
    private builder: ModalBuilder;
    public ast: Analyze<Parse> = {} as Analyze<Parse>

    get run() { return this.options.onSubmit }

    constructor(public options: ModalData<Parse, Cache>) {
        this.builder = new ModalBuilder(options as Partial<ModalComponentData>);
    }

    toComponentData(params: ParsePath<Parse>['params'], query?: ParsePath<Parse>['searchParams']): ModalBuilder {
        this.builder.setCustomId(buildCustomId(this.ast, params, query));
        return this.builder;
    }
}
