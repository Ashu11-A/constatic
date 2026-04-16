import { ApplicationCommandOptionType, ApplicationCommandType, InteractionContextType } from "discord.js";
import { ConstaticApp } from "../../app.js";
import type { CommandData, CommandModule, SubCommandGroupModuleData, SubCommandModuleData } from "../../types/command.js";

class GroupCommandModule<
    Type,
    Contexts extends readonly InteractionContextType[],
    Return,
    ModuleReturn
> {
    constructor(
        public readonly command: Command<Type, Contexts, Return>,
        public readonly data: SubCommandGroupModuleData<Contexts, Return, ModuleReturn>
    ) { }
    public subcommand(data: SubCommandModuleData<Contexts, ModuleReturn>) {
        data.group ??= this.data.name;
        this.command.subcommand(data);
        return this;
    }
}

export class Command<
    const Type = ApplicationCommandType.ChatInput,
    const Contexts extends readonly InteractionContextType[] = [InteractionContextType.Guild],
    const Return = void
> {
    public readonly modules: CommandModule[] = []

    constructor(
        public readonly data: CommandData<Type, Contexts, Return>
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

        ConstaticApp.getInstance().commands.set(this);
    }
    public group<ModuleReturn = Return>(data: SubCommandGroupModuleData<Contexts, Return, ModuleReturn>) {
        this.modules.push({
            ...data,
            type: ApplicationCommandOptionType.SubcommandGroup
        });
        return new GroupCommandModule<Type, Contexts, Return, ModuleReturn>(
            this, data
        );
    }
    public subcommand<R = Return>(data: SubCommandModuleData<Contexts, R>) {
        this.modules.push({
            ...data,
            type: ApplicationCommandOptionType.Subcommand
        });
        return this;
    }
}