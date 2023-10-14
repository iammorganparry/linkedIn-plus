import { AppMessageTypes, TabUpdatedPayload } from "@/types/messages";
import { useCallback, useEffect, useState } from "react";
import { getLinkedInAlias } from "./utils";

export const useAliasListener = () => {
  const [alias, setAlias] = useState<string | null>(null);

  const listenForRouterChanges = useCallback(() => {
    console.log("App -- listenForRouterChanges");
    window.addEventListener(
      AppMessageTypes.TabUpdated,
      (e: CustomEvent<TabUpdatedPayload>) => {
        console.log("tab updated -- App", e.detail);
        if (!e.detail.changeInfo.url) return;
        const alias = getLinkedInAlias(e.detail.changeInfo.url);
        if (!alias) return;
        setAlias(alias);
      }
    );
  }, []);

  useEffect(() => {
    listenForRouterChanges();
  }, [listenForRouterChanges]);

  return alias;
};
