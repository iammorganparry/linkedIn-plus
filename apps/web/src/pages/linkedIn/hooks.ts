import { useCallback, useEffect, useRef, useState } from "react";
import { getLinkedInAlias } from "./utils";
import {
  AppMessageEvents,
  AppMessageTypes,
  isOfType,
} from "@linkedinplus/shared";
import { messenger } from "@/services/messenger";

export const useAliasListener = () => {
  const [alias, setAlias] = useState<string | null>(null);
  const onLoadAlias = getLinkedInAlias(window.location.href);
  const listenerRef = useRef<void>();
  const listenForRouterChanges = useCallback(() => {
    console.log("App -- listenForRouterChanges");
    if (listenerRef.current) return;
    listenerRef.current = window.addEventListener(
      "message", // listen for messages from the background script
      (
        event: MessageEvent<
          AppMessageEvents<
            AppMessageTypes.FetchCurrentUrl | AppMessageTypes.TabUpdated
          >
        >
      ) => {
        try {
          if (
            isOfType(event.data, AppMessageTypes.TabUpdated) ||
            isOfType(event.data, AppMessageTypes.FetchCurrentUrl)
          ) {
            console.log(`${event.data.type} -- Web`, event.data.payload);
            const alias = getLinkedInAlias(event.data.payload.changeInfo?.url);
            console.log("alias", alias);
            setAlias(alias ?? null);
          }
        } catch (error) {
          console.error("onMessage error", error);
        }
      }
    );
  }, []);

  useEffect(() => {
    listenForRouterChanges();
    return () => {
      window.removeEventListener(
        "message", // listen for messages from the background script
        (
          event: MessageEvent<
            AppMessageEvents<
              AppMessageTypes.FetchCurrentUrl | AppMessageTypes.TabUpdated
            >
          >
        ) => {
          try {
            if (
              isOfType(event.data, AppMessageTypes.TabUpdated) ||
              isOfType(event.data, AppMessageTypes.FetchCurrentUrl)
            ) {
              console.log(`${event.data.type} -- Web`, event.data.payload);
              const alias = getLinkedInAlias(
                event.data.payload.changeInfo?.url
              );
              console.log("alias", alias);
              setAlias(alias ?? null);
            }
          } catch (error) {
            console.error("onMessage error", error);
          }
        }
      );
    };
  }, [listenForRouterChanges]);

  useEffect(() => {
    messenger.getCurrentUrl();
  }, []);

  return alias ?? onLoadAlias;
};
