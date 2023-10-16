import { LinkedInPublicProfileService } from "../linkedInProfile";
import { describe } from "node:test";
import { expect, it, vi } from "vitest";
import { createLinkedInProfileResponse } from "../../../__tests__/utils";
import { AppMessageEvents, AppMessageTypes } from "@linkedinplus/shared";
import { ShadowRootMessageHandler } from "../shadowRootMessageHandler";

const mockService = {
  getProfileByAlias: vi.fn(),
} as unknown as LinkedInPublicProfileService;

const handler = new ShadowRootMessageHandler(mockService);

describe("ShadowRootMessageHandler", () => {
  describe("listen", () => {
    it("should add a message event listener", () => {
      const addEventListenerSpy = vi.spyOn(window, "addEventListener");
      handler.listen();
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        "message",
        expect.any(Function)
      );
    });
  });

  describe("attachIframe", () => {
    it("should set the iframe property", () => {
      const iframe = document.createElement("iframe");
      handler.attachIframe(iframe);
      expect(handler["iframe"]).toBe(iframe);
    });
  });

  describe("handleTabUpdated", () => {
    it("should post a message with the updated tab info", () => {
      // @ts-expect-error - Private method
      const postMessageSpy = vi.spyOn(handler, "postMessage");
      // @ts-expect-error - Private method
      handler.handleTabUpdated({ tabId: 1 });
      expect(postMessageSpy).toHaveBeenCalledWith({
        type: AppMessageTypes.TabUpdated,
        payload: {
          tabId: 1,
          changeInfo: {
            status: "complete",
            url: window.location.href,
          },
        },
      });
    });
  });

  describe("handleFetchLinkedInProfile", () => {
    it("should call the LinkedInPublicProfileService with the correct arguments", async () => {
      // @ts-expect-error - Private method
      await handler.handleFetchLinkedInProfile({
        alias: "test",
        includes: ["profile"],
      });
      expect(mockService.getProfileByAlias).toHaveBeenCalledWith("test", [
        "profile",
      ]);
    });

    it("should post a message with the LinkedIn profile data", async () => {
      vi.spyOn(mockService, "getProfileByAlias").mockResolvedValueOnce({
        profile: createLinkedInProfileResponse(),
      });
      // @ts-expect-error - Private method

      const postMessageSpy = vi.spyOn(handler, "postMessage");
      // @ts-expect-error - Private method
      await handler.handleFetchLinkedInProfile({
        alias: "test",
        includes: ["profile"],
      });
      expect(postMessageSpy).toHaveBeenCalledWith({
        type: AppMessageTypes.PostLinkedInProfile,
        payload: {
          profile: createLinkedInProfileResponse(),
        },
      });
    });
  });

  describe("addToQueue", () => {
    it("should add a message to the queue", () => {
      const message: AppMessageEvents = {
        type: AppMessageTypes.FetchCurrentUrl,
        payload: {},
      };
      // @ts-expect-error - Private method
      handler.addToQueue(message);
      expect(handler["messageQueue"]).toContain(message);
    });
  });

  describe("processQueue", () => {
    it("should process the message queue", () => {
      const message1: AppMessageEvents = {
        type: AppMessageTypes.FetchCurrentUrl,
        payload: {},
      };
      const message2: AppMessageEvents = {
        type: AppMessageTypes.TabUpdated,
        payload: {},
      };
      // @ts-expect-error - Private method
      handler.addToQueue(message1);
      // @ts-expect-error - Private method
      handler.addToQueue(message2);
      // @ts-expect-error - Private method
      handler.processQueue();
      expect(handler["messageQueue"]).toEqual([]);
    });
  });

  describe("onMessage", () => {
    it("should add a message to the queue and process the queue", async () => {
      const message: AppMessageEvents = {
        type: AppMessageTypes.FetchCurrentUrl,
        payload: {},
      };
      // @ts-expect-error - Private method
      const spyAddToQueue = vi.spyOn(handler, "addToQueue");
      // @ts-expect-error - Private method
      const spyProcessQueue = vi.spyOn(handler, "processQueue");
      // @ts-expect-error - Private method
      await handler.onMessage({
        data: message,
      } as MessageEvent<AppMessageEvents>);
      expect(spyAddToQueue).toHaveBeenCalledWith(message);
      expect(spyProcessQueue).toHaveBeenCalled();
    });

    it("should call handleFetchCurrentUrl if the message type is FetchCurrentUrl", async () => {
      const handleFetchCurrentUrlSpy = vi.spyOn(
        handler,
        // @ts-expect-error - Private method
        "handleFetchCurrentUrl"
      );
      // @ts-expect-error - Private method
      await handler.onMessage({
        data: {
          type: AppMessageTypes.FetchCurrentUrl,
        },
      } as MessageEvent);
      expect(handleFetchCurrentUrlSpy).toHaveBeenCalled();
    });

    it("should call handleOpenMessageModal if the message type is openMessageModal", async () => {
      const handleFetchCurrentUrlSpy = vi.spyOn(
        handler,
        // @ts-expect-error - Private method
        "handleOpenMessageModal"
      );
      // @ts-expect-error - Private method
      await handler.onMessage({
        data: {
          type: AppMessageTypes.OpenMessageModal,
        },
      } as MessageEvent);
      expect(handleFetchCurrentUrlSpy).toHaveBeenCalled();
    });

    it("should call handleTabUpdated if the message type is TabUpdated", async () => {
      // @ts-expect-error - Private method
      const handleTabUpdatedSpy = vi.spyOn(handler, "handleTabUpdated");
      // @ts-expect-error - Private method
      await handler.onMessage({
        data: {
          type: AppMessageTypes.TabUpdated,
          payload: {
            tabId: 1,
            changeInfo: {
              url: "https://example.com",
            },
          },
        },
      } as MessageEvent);
      expect(handleTabUpdatedSpy).toHaveBeenCalled();
    });

    it("should call handleFetchLinkedInProfile if the message type is FetchLinkedInProfile", async () => {
      const handleFetchLinkedInProfileSpy = vi.spyOn(
        handler,
        // @ts-expect-error - Private method
        "handleFetchLinkedInProfile"
      );
      // @ts-expect-error - Private method
      await handler.onMessage({
        data: {
          type: AppMessageTypes.FetchLinkedInProfile,
          payload: {
            alias: "test",
            includes: ["profile"],
          },
        },
      } as MessageEvent);
      expect(handleFetchLinkedInProfileSpy).toHaveBeenCalled();
    });
  });

  describe("postMessage", () => {
    it("should post a message to the iframe", () => {
      const iframe = {
        contentWindow: {
          postMessage: vi.fn(),
        },
      };
      const postMessageSpy = vi.spyOn(iframe.contentWindow, "postMessage");
      // @ts-expect-error - Private method
      handler.attachIframe(iframe);
      // @ts-expect-error - Private method
      handler.postMessage({
        type: AppMessageTypes.FetchCurrentUrl,
        payload: {
          changeInfo: {
            url: "https://example.com",
          },
        },
      });
      expect(postMessageSpy).toHaveBeenCalledWith(
        {
          type: AppMessageTypes.FetchCurrentUrl,
          payload: {
            changeInfo: {
              url: "https://example.com",
            },
          },
        },
        "*"
      );
    });
  });

  describe("handleOpenMessageModal", () => {
    it("should open the message modal", () => {
      const mockCustomEvent = vi.fn();
      const mockDispatchEvent = vi.fn();
      global.CustomEvent = mockCustomEvent;
      global.dispatchEvent = mockDispatchEvent;
      const message: AppMessageEvents = {
        type: AppMessageTypes.OpenMessageModal,
        payload: {},
      };
      // @ts-expect-error - Private method
      handler.handleOpenMessageModal(message.payload);
      expect(mockCustomEvent).toHaveBeenCalledWith(
        AppMessageTypes.OpenMessageModal,
        {
          detail: message.payload,
        }
      );

      expect(mockDispatchEvent).toHaveBeenCalledWith(
        new mockCustomEvent(AppMessageTypes.OpenMessageModal, {
          detail: message.payload,
        })
      );
    });
  });
});
