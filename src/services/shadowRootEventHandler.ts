import { AppMessageEvents, AppMessageTypes } from "@/types/messages";

export class ShadowRootEventHandler {
  constructor() {}

  public listen() {
    console.log("ShadowRootEventHandler listen");
    window.addEventListener("message", this.onMessage.bind(this));
  }

  private onMessage(event: MessageEvent<AppMessageEvents>) {
    try {
      if (event.data.type === AppMessageTypes.TabUpdated) {
        console.log(
          "tab updated -- ShadowRootEventHandler",
          event.data.payload
        );
        window.dispatchEvent(
          new CustomEvent("tabUpdated", {
            detail: {
              changeInfo: {
                url: window.location.href,
              },
            },
          })
        );
      }
    } catch (error) {
      console.log("onMessage error", error);
    }
  }
}
