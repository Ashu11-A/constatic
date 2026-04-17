import { ModalBuilder, type CacheType, type ModalComponentData } from "discord.js";
import { ResponderType } from "../../types/responder.js";
import type { ModalActionData } from "../../types/actions.js";
import { BaseAction } from "./base.js";

export type GenericModal = Modal<any, CacheType>

export class Modal<
    const Parse extends string,
    const Cache extends CacheType = 'cached'
> extends BaseAction<Parse, Cache, ModalBuilder, ModalActionData<Parse, Cache>> {
    public readonly type = ResponderType.Modal;
    protected builder: ModalBuilder;

    get run() { return this.options.onSubmit }

    constructor(options: ModalActionData<Parse, Cache>) {
        super(options);
        this.builder = new ModalBuilder(options as Partial<ModalComponentData>);
    }
}
