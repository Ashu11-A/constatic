import { ButtonBuilder, ButtonStyle, type APIButtonComponent, type ButtonComponentData, type CacheType } from "discord.js";
import type { Analyze, ParsePath } from "url-ast";
import { ResponderType, type ResponderData, type ResponderInteraction } from "../../types/responder.js";
import { Responder } from "../responders/responder.js";
import { buildCustomId } from "./utils.js";

export type GenericButton = Button<any, CacheType>

type ButtonData<Parse extends string, Cache extends CacheType> = {
  cache?: Cache
  parser: Parse
  onClick: (
    this: ResponderData<Parse, [ResponderType.Button], Cache>,
    interaction: ResponderInteraction<ResponderType.Button, Cache>,
    params: ParsePath<Parse>['fragment'] & ParsePath<Parse>['params'] & ParsePath<Parse>['searchParams']
  ) => Promise<void>
} & (Omit<Partial<ButtonComponentData>, 'customId' | 'custom_id'> | Partial<APIButtonComponent>)

export class Button<
  const Parse extends string,
  const Cache extends CacheType = 'cached'
> {
  public readonly type = ResponderType.Button;
  public responder!: Responder<any, any, any>
  private builder: ButtonBuilder;
  public ast: Analyze<Parse> = {} as Analyze<Parse>

  get run() { return this.options.onClick }

  constructor(public options: ButtonData<Parse, Cache>) {
    this.builder = new ButtonBuilder(options as Partial<ButtonComponentData> | Partial<APIButtonComponent>);

    if (!this.builder.data.style) this.builder.setStyle(ButtonStyle.Primary);
  }

  toComponentData(params: ParsePath<Parse>['params'], query?: ParsePath<Parse>['searchParams']): ButtonBuilder {
    this.builder.setCustomId(buildCustomId(this.ast, params, query));
    return this.builder;
  }
}