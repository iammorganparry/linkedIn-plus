import { type AppMessageEvents, AppMessageTypes } from "@linkedinplus/shared";

type IMessenger = {
  onTabUpdated: (
    tabId: chrome.tabs.Tab["id"],
    changeInfo: chrome.tabs.TabChangeInfo,
    tab: chrome.tabs.Tab
  ) => void;
};

export class BackgroundMessenger implements IMessenger {
  constructor() {
    this.init();
  }

  init() {
    console.log("BackgroundMessenger init");
    chrome.tabs.onUpdated.addListener(this.onTabUpdated.bind(this));
  }

  public async onTabUpdated(
    tabId: chrome.tabs.Tab["id"],
    changeInfo: chrome.tabs.TabChangeInfo
  ) {
    try {
      if (changeInfo.status === "complete" && tabId) {
        console.log("tab updated -- Background", tabId, changeInfo);
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          tabs.forEach((tab) => {
            if (tab?.id && tab?.active && tab.active) {
              console.log("tab updated -- Background", tab.id, changeInfo);
              // only message if the url has changed
              this.sendTabMessage(tab.id, {
                type: AppMessageTypes.TabUpdated,
                payload: {
                  tabId,
                  changeInfo,
                },
              });
            }
          });
        });
      }
    } catch (error) {
      console.log("onTabUpdated error", error);
    }
  }

  public sendTabMessage(tabId: number, message: AppMessageEvents) {
    chrome.tabs.sendMessage(tabId, message);
  }
}
