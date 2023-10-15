import type { AppMessageTypes, AppMessageEvents } from "./types/messages";

export function isOfType<T extends AppMessageTypes>(
  message: AppMessageEvents,
  type: T
): message is AppMessageEvents<T> {
  return message.type === type;
}
