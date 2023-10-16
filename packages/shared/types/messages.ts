import { LinkedInProfile, LinkedInProfileIncludes } from "./linkedIn";

export enum AppMessageTypes {
  TabUpdated = "tabUpdated",
  FetchLinkedInProfile = "fetchLinkedInProfile",
  PostLinkedInProfile = "postLinkedInProfile",
  FetchCurrentUrl = "fetchCurrentUrl",
  OpenMessageModal = "openMessageModal",
}

export type TabUpdatedPayload = {
  tabId: chrome.tabs.Tab["id"];
  changeInfo: chrome.tabs.TabChangeInfo;
};

export type FetchLinkedInProfilePayload = {
  alias: string;
  includes: LinkedInProfileIncludes[];
};

type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};
export type AppMessageEvents<TType extends AppMessageTypes = AppMessageTypes> =
  {
    type: TType;
    payload: TType extends AppMessageTypes.TabUpdated
      ? TabUpdatedPayload
      : TType extends AppMessageTypes.FetchLinkedInProfile
      ? FetchLinkedInProfilePayload
      : TType extends AppMessageTypes.PostLinkedInProfile
      ? PartialRecord<LinkedInProfileIncludes, LinkedInProfile>
      : TType extends AppMessageTypes.FetchCurrentUrl
      ? Partial<TabUpdatedPayload>
      : never;
  };
