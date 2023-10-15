import { LinkedInProfileIncludes } from "../../../../../packages/shared/types/linkedIn";
import { messenger } from "@/services/messenger";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppMessageEvents, AppMessageTypes } from "@linkedinplus/shared";
export const getProfileData = (
  alias: string,
  includes: LinkedInProfileIncludes[] = ["profile"]
) => {
  messenger.getLinkedInProfile(alias, includes);
};

export const useLinkedInProfile = (alias?: string) => {
  const [data, setData] = useState<
    AppMessageEvents<AppMessageTypes.PostLinkedInProfile>["payload"] | null
  >(null);
  const [loading, setLoading] = useState(false);
  const listenerRef = useRef<void>();

  const postListener = useCallback(
    (data: AppMessageEvents<AppMessageTypes.PostLinkedInProfile>) => {
      console.log("Got Profile Data", data);
      if (data) {
        setLoading(false);
        setData(data.payload);
      }
    },
    []
  );

  const listenForProfile = useCallback(() => {
    if (listenerRef.current) return;
    messenger.addMessageListener(
      AppMessageTypes.PostLinkedInProfile,
      postListener
    );
  }, [postListener]);

  useEffect(() => {
    listenForProfile();
    return () => {
      messenger.removeMessageListener(
        AppMessageTypes.PostLinkedInProfile,
        postListener
      );
    };
  }, [listenForProfile, postListener]);

  useEffect(() => {
    if (alias) {
      setLoading(true);
      getProfileData(alias, ["position", "profile", "education"]);
    }
  }, [alias]);

  console.log({
    data,
  });
  return { data, isFetching: loading };
};
