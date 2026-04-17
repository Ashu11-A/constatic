import { ApplicationCommandOptionType, ApplicationCommandType, InteractionContextType } from "discord.js";
import { Analyze } from "url-ast";
import { ConstaticApp } from "../../app.js";
import type { CommandData, CommandModule, SubCommandGroupModuleData, SubCommandModuleData } from "../../types/command.js";
import { type GenericAction } from "../actions/index.js";
import { Responder } from "../responders/responder.js";

class GroupCommandModule<
    Type,
    Contexts extends readonly InteractionContextType[],
    Actions extends Record<string, GenericAction>,
    Return,
    ModuleReturn
> {
    constructor(
        public readonly command: Command<Type, Contexts, Actions, Return>,
        public readonly data: SubCommandGroupModuleData<Contexts, Actions, Return, ModuleReturn>
    ) { }
    public subcommand(data: SubCommandModuleData<Contexts, Actions, ModuleReturn>) {
        data.group ??= this.data.name;
        this.command.subcommand(data);
        return this;
    }
}

export class Command<
    const Type = ApplicationCommandType.ChatInput,
    const Contexts extends readonly InteractionContextType[] = [InteractionContextType.Guild],
    const Actions extends Record<string, GenericAction> = {},
    const Return = void
> {
    public readonly modules: CommandModule[] = []

    constructor(
        public readonly data: CommandData<Type, Contexts, Actions, Return>
    ) {
        this.data.type ??= <Type>ApplicationCommandType.ChatInput
        if (this.data.type === ApplicationCommandType.ChatInput) {
            this.data.description ??= this.data.name;
            this.data.name = this.data.name
                .toLowerCase()
                .replaceAll(" ", "");
        }
        if (this.data.name.length > 32) {
            this.data.name = this.data.name.slice(0, 32);
        }
        if (!this.data.contexts){
            Object.assign(this.data, {
                contexts: [InteractionContextType.Guild]
            });
        }
        
        for (const key in this.data.actions) {
          const action = this.data.actions[key]
          const ast = new Analyze(`/${this.data.name}${action.options.parser}`)
          this.data.actions[key].ast = ast


          new Responder({
            customId: ast.getPathname(),
            types: [action.type],
            run: action.run as any,
            cache: action.options.cache
          })
        }

        ConstaticApp.getInstance().commands.set(this);
    }
    public group<ModuleReturn = Return>(data: SubCommandGroupModuleData<Contexts, Actions, Return, ModuleReturn>) {
        this.modules.push({
            ...data,
            type: ApplicationCommandOptionType.SubcommandGroup
        });
        return new GroupCommandModule<Type, Contexts, Actions, Return, ModuleReturn>(
            this, data
        );
    }
    public subcommand<R = Return>(data: SubCommandModuleData<Contexts, Actions, R>) {
        this.modules.push({
            ...data,
            type: ApplicationCommandOptionType.Subcommand
        });
        return this;
    }
}