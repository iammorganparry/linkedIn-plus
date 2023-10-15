import { LinkedInProfile, LinkedInProfileIncludes } from "./linkedIn";

export enum AppMessageTypes {
  TabUpdated = "tabUpdated",
  FetchLinkedInProfile = "fetchLinkedInProfile",
  PostLinkedInProfile = "postLinkedInProfile",
  FetchCurrentUrl = "fetchCurrentUrl",
}

export type TabUpdatedPayload = {
  tabId: chrome.tabs.Tab["id"];
  changeInfo: chrome.tabs.TabChangeInfo;
};

export type FetchLinkedInProfilePayload = {
  alias: string;
  includes: LinkedInProfileIncludes[];
};

export type AppMessageEvents<TType extends AppMessageTypes = AppMessageTypes> =
  {
    type: TType;
    payload: TType extends AppMessageTypes.TabUpdated
      ? TabUpdatedPayload
      : TType extends AppMessageTypes.FetchLinkedInProfile
      ? FetchLinkedInProfilePayload
      : TType extends AppMessageTypes.PostLinkedInProfile
      ? Record<LinkedInProfileIncludes, LinkedInProfile>
      : TType extends AppMessageTypes.FetchCurrentUrl
      ? Partial<TabUpdatedPayload>
      : never;
  };
