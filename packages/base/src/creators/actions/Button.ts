import { ButtonBuilder, ButtonStyle, type APIButtonComponent, type ButtonComponentData, type CacheType } from "discord.js";
import { ResponderType } from "../../types/responder.js";
import type { ButtonData } from "../../types/actions.js";
import { BaseAction } from "./base.js";

export type GenericButton = Button<any, any>

export class Button<
    const Parse extends string,
    const Cache extends CacheType = 'cached'
> extends BaseAction<Parse, Cache, ButtonBuilder, ButtonData<Parse, Cache>> {
    public readonly type = ResponderType.Button;
    protected builder: ButtonBuilder;

    get run() { return this.options.onClick }

    constructor(options: ButtonData<Parse, Cache>) {
        super(options);
        this.builder = new ButtonBuilder(options as Partial<ButtonComponentData> | Partial<APIButtonComponent>);
        if (!this.builder.data.style) this.builder.setStyle(ButtonStyle.Primary);
    }
}
