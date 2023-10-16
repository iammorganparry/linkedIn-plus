import {
  type AppMessageEvents,
  AppMessageTypes,
  isOfType,
} from "@linkedinplus/shared";
import { LinkedInPublicProfileService } from "./linkedInProfile";

/**
 * Handles messages between the content script and the iframe (bidirectional)
 */
export class ShadowRootMessageHandler {
  private iframe?: HTMLIFrameElement;
  private messageQueue: AppMessageEvents[] = [];
  private timer: NodeJS.Timeout | null = null;
  constructor(private linkedInProfileService: LinkedInPublicProfileService) {}

  public listen() {
    console.log("ShadowRootMessageHandler listen");
    window.addEventListener("message", this.onMessage.bind(this));
  }

  public attachIframe(iframe: HTMLIFrameElement) {
    console.log("ShadowRootMessageHandler attachIframe");
    this.iframe = iframe;
  }

  private handleTabUpdated(
    payload: AppMessageEvents<AppMessageTypes.TabUpdated>["payload"]
  ) {
    console.log("tab updated -- ShadowRootMessageHandler", payload);
    this?.postMessage({
      type: AppMessageTypes.TabUpdated,
      payload: {
        tabId: payload.tabId,
        changeInfo: {
          status: "complete",
          url: window.location.href,
        },
      },
    });
  }

  private async handleFetchLinkedInProfile(
    payload: AppMessageEvents<AppMessageTypes.FetchLinkedInProfile>["payload"]
  ) {
    console.log("fetch linkedin profile -- ShadowRootMessageHandler", payload);
    const data = await this.linkedInProfileService.getProfileByAlias(
      payload.alias,
      payload.includes
    );
    this.postMessage({
      type: AppMessageTypes.PostLinkedInProfile,
      payload: data,
    });
  }

  private handleFetchCurrentUrl(
    payload: AppMessageEvents<AppMessageTypes.FetchCurrentUrl>["payload"]
  ) {
    console.log("fetch current url -- ShadowRootMessageHandler", payload);
    this.postMessage({
      type: AppMessageTypes.FetchCurrentUrl,
      payload: {
        changeInfo: {
          url: window.location.href,
        },
      },
    });
  }

  private handleOpenMessageModal(
    payload: AppMessageEvents<AppMessageTypes.OpenMessageModal>["payload"]
  ) {
    console.log("open message modal -- ShadowRootMessageHandler", payload);
    this.dispatchEvent({
      type: AppMessageTypes.OpenMessageModal,
      payload,
    });
  }

  private addToQueue(message: AppMessageEvents) {
    console.log("addToQueue", message);
    this.messageQueue.push(message);
    // after 1 second, process the queue
  }

  private processQueue() {
    console.log("processQueue");
    while (this.messageQueue.length) {
      // filter out duplicates
      const filteredMessages = this.messageQueue.filter(
        (message, index, self) =>
          index === self.findIndex((m) => m.type === message.type)
      );
      this.messageQueue = filteredMessages;

      const message = this.messageQueue.shift();
      if (message) {
        if (isOfType(message, AppMessageTypes.FetchCurrentUrl)) {
          this.handleFetchCurrentUrl(message.payload);
        }
        if (isOfType(message, AppMessageTypes.TabUpdated)) {
          this.handleTabUpdated(message.payload);
        }
        if (isOfType(message, AppMessageTypes.FetchLinkedInProfile)) {
          console.log("fetch linkedin profile -- ShadowRootMessageHandler");
          this.handleFetchLinkedInProfile(message.payload);
        }
        if (isOfType(message, AppMessageTypes.OpenMessageModal)) {
          console.log("open message modal -- ShadowRootMessageHandler");
          this.handleOpenMessageModal(message.payload);
        }
      }
    }
  }

  private onMessage(event: MessageEvent<AppMessageEvents>) {
    return new Promise((resolve, reject) => {
      try {
        this.addToQueue(event.data);
        if (this.timer) {
          clearTimeout(this.timer);
        }
        setTimeout(() => {
          this.processQueue();
          resolve(true);
        }, 500);
      } catch (error) {
        reject();
        console.log("onMessage error", error);
      }
    });
  }

  private dispatchEvent(message: AppMessageEvents) {
    window.dispatchEvent(
      new CustomEvent(message.type, {
        detail: message.payload,
      })
    );
  }

  private postMessage(message: AppMessageEvents) {
    this?.iframe?.contentWindow?.postMessage(message, "*");
  }
}
