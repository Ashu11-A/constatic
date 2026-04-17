import type { CacheType } from "discord.js";
import { Analyze } from "url-ast";
import { ConstaticApp } from "../../app.js";
import { ResponderType, type ResponderData } from "../../types/responder.js";

export class Responder<
    Path extends string,
    Types extends readonly ResponderType[],
    Cache extends CacheType,
> {
    readonly ast: Analyze<Path>
    
    constructor(
        public readonly data: ResponderData<Path, Types, Cache>
    ){
      this.ast = new Analyze(this.data.customId)
      ConstaticApp.getInstance().responders.set(this)
    }
}