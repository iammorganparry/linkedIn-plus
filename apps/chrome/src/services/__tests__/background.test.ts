import { beforeEach, afterEach, expect, vi, describe, it } from "vitest";
import { BackgroundMessenger } from "../background";
import { AppMessageTypes } from "@linkedinplus/shared";

describe("BackgroundMessenger", () => {
  let backgroundMessenger: BackgroundMessenger;

  beforeEach(() => {
    backgroundMessenger = new BackgroundMessenger();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("init", () => {
    it("should add listener to onUpdated event", () => {
      const spy = vi.spyOn(chrome.tabs.onUpdated, "addListener");
      backgroundMessenger.init();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe("onTabUpdated", () => {
    it("should not send message if status is not complete", () => {
      const sendTabMessageSpy = vi.spyOn(backgroundMessenger, "sendTabMessage");
      backgroundMessenger.onTabUpdated(123, { status: "loading" });
      expect(sendTabMessageSpy).not.toHaveBeenCalled();
    });

    it("should not send message if tabId is not defined", () => {
      const sendTabMessageSpy = vi.spyOn(backgroundMessenger, "sendTabMessage");
      backgroundMessenger.onTabUpdated(undefined, { status: "complete" });
      expect(sendTabMessageSpy).not.toHaveBeenCalled();
    });

    it("should send message if status is complete and tabId is defined and if tab is active", async () => {
      const sendTabMessageSpy = vi.spyOn(backgroundMessenger, "sendTabMessage");
      await backgroundMessenger.onTabUpdated(123, { status: "complete" });
      expect(sendTabMessageSpy).toHaveBeenCalled();
    });
  });

  describe("sendTabMessage", () => {
    it("should call chrome.tabs.sendMessage with the correct arguments", () => {
      const sendMessageSpy = vi.spyOn(chrome.tabs, "sendMessage");
      backgroundMessenger.sendTabMessage(123, {
        type: AppMessageTypes.TabUpdated,
        payload: {
          tabId: 123,
          changeInfo: {
            status: "complete",
            url: "https://example.com",
          },
        },
      });
      expect(sendMessageSpy).toHaveBeenCalledWith(123, {
        type: AppMessageTypes.TabUpdated,
        payload: {
          tabId: 123,
          changeInfo: {
            status: "complete",
            url: "https://example.com",
          },
        },
      });
    });
  });
});
