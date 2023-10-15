import { AppMessageTypes, type AppMessageEvents } from "@linkedinplus/shared";

type IContentMessenger = {
  init: () => void;
};

export class ContentMessenger implements IContentMessenger {
  constructor() {}

  init() {
    console.log("ContentMessenger initEvents");
    chrome.runtime.onMessage.addListener(this.onMessage.bind(this));
  }

  private onMessage(
    message: AppMessageEvents,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: unknown) => void
  ) {
    try {
      console.log("ContentMessenger onMessage", message, sender);
      sendResponse({ received: true });
      switch (message.type) {
        case AppMessageTypes.TabUpdated:
          console.log("tab updated -- ContentMessenger", message.payload);
          this.sendMessage({
            type: AppMessageTypes.TabUpdated,
            payload: {
              tabId: sender.tab?.id,
              changeInfo: {
                status: "complete",
                url: window.location.href,
              },
            },
          });
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("onMessage error", error);
    }
  }

  private sendMessage(message: AppMessageEvents) {
    window.postMessage(message, "*");
  }
}
