import { ModalBuilder, type CacheType, type ModalComponentData } from "discord.js";
import { ResponderType } from "../../types/responder.js";
import type { ModalComponentActionData } from "../../types/actions.js";
import { BaseAction } from "./base.js";

export type GenericModalComponent = ModalComponent<any, any>

export class ModalComponent<
    const Parse extends string,
    const Cache extends CacheType = 'cached'
> extends BaseAction<Parse, Cache, ModalBuilder, ModalComponentActionData<Parse, Cache>> {
    public readonly type = ResponderType.ModalComponent;
    protected builder: ModalBuilder;

    get run() { return this.options.onSubmit }

    constructor(options: ModalComponentActionData<Parse, Cache>) {
        super(options);
        this.builder = new ModalBuilder(options as Partial<ModalComponentData>);
    }
}
