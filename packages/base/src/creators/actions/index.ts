export { Button, type GenericButton } from "./Button.js";
export { StringSelect, type GenericStringSelect } from "./StringSelect.js";
export { UserSelect, type GenericUserSelect } from "./UserSelect.js";
export { RoleSelect, type GenericRoleSelect } from "./RoleSelect.js";
export { ChannelSelect, type GenericChannelSelect } from "./ChannelSelect.js";
export { MentionableSelect, type GenericMentionableSelect } from "./MentionableSelect.js";
export { Modal, type GenericModal } from "./Modal.js";
export { ModalComponent, type GenericModalComponent } from "./ModalComponent.js";

import type { GenericButton } from "./Button.js";
import type { GenericStringSelect } from "./StringSelect.js";
import type { GenericUserSelect } from "./UserSelect.js";
import type { GenericRoleSelect } from "./RoleSelect.js";
import type { GenericChannelSelect } from "./ChannelSelect.js";
import type { GenericMentionableSelect } from "./MentionableSelect.js";
import type { GenericModal } from "./Modal.js";
import type { GenericModalComponent } from "./ModalComponent.js";

export type GenericAction =
    | GenericButton
    | GenericStringSelect
    | GenericUserSelect
    | GenericRoleSelect
    | GenericChannelSelect
    | GenericMentionableSelect
    | GenericModal
    | GenericModalComponent;
