export enum AppMessageTypes {
  TabUpdated = "tabUpdated",
}

export type TabUpdatedPayload = {
  tabId: chrome.tabs.Tab["id"];
  changeInfo: chrome.tabs.TabChangeInfo;
};

export type AppMessageEvents<TType = AppMessageTypes> = {
  type: TType;
  payload: TType extends AppMessageTypes.TabUpdated ? TabUpdatedPayload : never;
};
