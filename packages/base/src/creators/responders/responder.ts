import type { CacheType } from "discord.js";
import { ConstaticApp } from "../../app.js";
import type { ResponderData, ResponderType } from "../../types/responder.js";

export class Responder<
    Path extends string,
    Types extends readonly ResponderType[],
    out Parsed,
    Cache extends CacheType,
> {
    constructor(
        public readonly data: ResponderData<Path, Types, Parsed, Cache>
    ){
      ConstaticApp.getInstance().responders.set(this)
    }
}