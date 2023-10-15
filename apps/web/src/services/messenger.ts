import {
  AppMessageEvents,
  AppMessageTypes,
  LinkedInProfileIncludes,
  isOfType,
} from "@linkedinplus/shared";

class Messenger {
  constructor() {}

  public addMessageListener<TType extends AppMessageTypes>(
    type: TType,
    callback: (data: AppMessageEvents<TType>) => void
  ) {
    window.addEventListener("message", (event) => {
      if (isOfType(event.data, type)) {
        callback(event.data);
      }
    });
  }

  public removeMessageListener<TType extends AppMessageTypes>(
    type: TType,
    callback: (data: AppMessageEvents<TType>) => void
  ) {
    window.removeEventListener("message", (event) => {
      if (isOfType(event.data, type)) {
        callback(event.data);
      }
    });
  }

  public getLinkedInProfile(
    alias: string,
    includes: LinkedInProfileIncludes[]
  ) {
    this.postParentMessage({
      type: AppMessageTypes.FetchLinkedInProfile,
      payload: {
        alias,
        includes,
      },
    });
  }

  public getCurrentUrl() {
    this.postParentMessage({
      type: AppMessageTypes.FetchCurrentUrl,
      payload: {
        changeInfo: {
          url: window.location.href,
        },
      },
    });
  }

  private postParentMessage(message: AppMessageEvents) {
    window.parent.postMessage(message, "*");
  }

  public postMessage(message: AppMessageEvents) {
    window.postMessage(message, "*");
  }
}

export const messenger = new Messenger();
