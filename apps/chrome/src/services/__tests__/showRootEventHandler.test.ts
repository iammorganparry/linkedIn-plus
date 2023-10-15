import { ShadowRootEventHandler } from "../shadowRootEventHandler";
import { LinkedInPublicProfileService } from "../linkedInProfile";
import { describe } from "node:test";
import { expect, it, vi } from "vitest";
import { createLinkedInProfileResponse } from "../../../__tests__/utils";
import { AppMessageTypes } from "@linkedinplus/shared";

const mockService = {
  getProfileByAlias: vi.fn(),
} as unknown as LinkedInPublicProfileService;

const handler = new ShadowRootEventHandler(mockService);

describe("ShadowRootEventHandler", () => {
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

  describe("onMessage", () => {
    it("should call handleFetchCurrentUrl if the message type is FetchCurrentUrl", () => {
      const handleFetchCurrentUrlSpy = vi.spyOn(
        handler,
        // @ts-expect-error - Private method
        "handleFetchCurrentUrl"
      );
      // @ts-expect-error - Private method
      handler.onMessage({
        data: {
          type: AppMessageTypes.FetchCurrentUrl,
        },
      } as MessageEvent);
      expect(handleFetchCurrentUrlSpy).toHaveBeenCalled();
    });

    it("should call handleTabUpdated if the message type is TabUpdated", () => {
      // @ts-expect-error - Private method
      const handleTabUpdatedSpy = vi.spyOn(handler, "handleTabUpdated");
      // @ts-expect-error - Private method
      handler.onMessage({
        data: {
          type: AppMessageTypes.TabUpdated,
        },
      } as MessageEvent);
      expect(handleTabUpdatedSpy).toHaveBeenCalled();
    });

    it("should call handleFetchLinkedInProfile if the message type is FetchLinkedInProfile", () => {
      const handleFetchLinkedInProfileSpy = vi.spyOn(
        handler,
        // @ts-expect-error - Private method
        "handleFetchLinkedInProfile"
      );
      // @ts-expect-error - Private method
      handler.onMessage({
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
});
