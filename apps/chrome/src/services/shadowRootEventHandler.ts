import {
  type AppMessageEvents,
  AppMessageTypes,
  isOfType,
} from "@linkedinplus/shared";
import { LinkedInPublicProfileService } from "./linkedInProfile";

/**
 * This class is responsible for listening to messages from the shadow root iframe and responding to them.
 */
export class ShadowRootEventHandler {
  private iframe?: HTMLIFrameElement;
  constructor(private linkedInProfileService: LinkedInPublicProfileService) {}

  public listen() {
    console.log("ShadowRootEventHandler listen");
    window.addEventListener("message", this.onMessage.bind(this));
  }

  public attachIframe(iframe: HTMLIFrameElement) {
    console.log("ShadowRootEventHandler attachIframe");
    this.iframe = iframe;
  }

  private handleTabUpdated(
    payload: AppMessageEvents<AppMessageTypes.TabUpdated>["payload"]
  ) {
    console.log("tab updated -- ShadowRootEventHandler", payload);
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
    console.log("fetch linkedin profile -- ShadowRootEventHandler", payload);
    const data = await this.linkedInProfileService.getProfileByAlias(
      payload.alias,
      payload.includes
    );
    this.postMessage({
      type: AppMessageTypes.PostLinkedInProfile,
      payload: data,
    });
  }

  private onMessage(event: MessageEvent<AppMessageEvents>) {
    try {
      if (isOfType(event.data, AppMessageTypes.FetchCurrentUrl)) {
        console.log("fetch current url -- ShadowRootEventHandler");
        this.postMessage({
          type: AppMessageTypes.FetchCurrentUrl,
          payload: {
            changeInfo: {
              url: window.location.href,
            },
          },
        });
      }
      if (isOfType(event.data, AppMessageTypes.TabUpdated)) {
        this.handleTabUpdated(event.data.payload);
      }
      if (isOfType(event.data, AppMessageTypes.FetchLinkedInProfile)) {
        console.log("fetch linkedin profile -- ShadowRootEventHandler");
        this.handleFetchLinkedInProfile(event.data.payload);
      }
    } catch (error) {
      console.log("onMessage error", error);
    }
  }

  private postMessage(message: AppMessageEvents) {
    this?.iframe?.contentWindow?.postMessage(message, "*");
  }
}
