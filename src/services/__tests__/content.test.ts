import { beforeEach, describe, expect, it, vi } from "vitest";
import { ContentMessenger } from "../content";
import { AppMessageTypes } from "@/types/messages";

// mock chrome
global.chrome = {
  runtime: {
    // @ts-ignore - we don't need to mock the whole chrome API
    onMessage: {
      addListener: vi.fn(),
    },
  },
  tabs: {
    // @ts-ignore - we don't need to mock the whole chrome API
    sendMessage: vi.fn(),
  },
};

describe("ContentMessenger", () => {
  let contentMessenger: ContentMessenger;

  beforeEach(() => {
    contentMessenger = new ContentMessenger();
  });

  it("should initialize", () => {
    const spy = vi.spyOn(chrome.runtime.onMessage, "addListener");
    contentMessenger.init();
    expect(spy).toHaveBeenCalled();
  });

  it("should handle tab updated message", () => {
    const message = {
      type: AppMessageTypes.TabUpdated,
      payload: {
        tabId: 123,
        changeInfo: {
          status: "complete",
          url: "http://localhost:3000/",
        },
      },
    };
    const sendResponse = vi.fn();
    contentMessenger["sendMessage"] = vi.fn();
    // @ts-ignore - we don't need to mock the whole chrome API
    contentMessenger["onMessage"](message, { tab: { id: 123 } }, sendResponse);
    expect(sendResponse).toHaveBeenCalledWith({ received: true });
    expect(contentMessenger["sendMessage"]).toHaveBeenCalledWith(message);
  });
});
