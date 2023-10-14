import { useQuery } from "@tanstack/react-query";
import { profileService } from "../../services/linkedInProfile";
import { LinkedInProfileIncludes } from "../../types/linkedIn";

const getProfileData = async (
  alias: string,
  includes: LinkedInProfileIncludes[] = ["profile"]
) => await profileService.getProfileByAlias(alias, includes);

export const useLinkedInProfile = (alias: string | null) => {
  const query = useQuery({
    queryKey: [alias],
    queryFn: () => getProfileData(alias ?? ""),
    enabled: !!alias,
    retry: 0,
  });
  return query;
};
