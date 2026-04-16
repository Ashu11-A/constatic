import { ConstaticApp } from "../../app.js";
import type { ClientEventKey, EventData } from "../../types/event.js";

export class Event<EventName extends ClientEventKey> {
    constructor(
        public readonly data: EventData<EventName>
    ){
      ConstaticApp.getInstance().events.add(this);
    }
}