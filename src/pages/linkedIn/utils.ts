export const getLinkedInAlias = (url?: string) =>
  url?.split("in/")[1]?.split("/")[0];
