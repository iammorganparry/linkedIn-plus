import {
  IncludedTypes,
  type LinkedInProfile,
  type LinkedInProfileIncludes,
} from "@linkedinplus/shared";
import axios, { AxiosInstance } from "axios";

type LinkedInPublicProfileResponse<TResponse> = {
  data: Record<string, unknown>;
  included: TResponse[];
};

export class LinkedInPublicProfileService {
  private api: AxiosInstance;
  private postfix: string;
  private prefix: string;
  private profileDataKey: string;
  private dataKeyMap: Record<LinkedInProfileIncludes, IncludedTypes>;

  constructor() {
    this.api = axios.create({
      baseURL: "https://www.linkedin.com",
      headers: {
        "Csrf-Token": this.csrfToken(),
        Accept: "application/vnd.linkedin.normalized+json+2.1",
      },
    });
    this.prefix =
      "/voyager/api/identity/dash/profiles?q=memberIdentity&memberIdentity=";
    this.postfix =
      "&decorationId=com.linkedin.voyager.dash.deco.identity.profile.WebTopCardCore-22";
    this.profileDataKey = IncludedTypes.LinkedInProfile;

    this.dataKeyMap = {
      profile: IncludedTypes.LinkedInProfile,
      education: IncludedTypes.LinkedInPosition,
      position: IncludedTypes.LinkedInEducation,
    };
  }

  private csrfToken(): string {
    const cookies = document.cookie.split("; ");
    const csrfCookie = cookies.find((cookie) =>
      cookie.startsWith("JSESSIONID")
    );
    if (!csrfCookie) {
      throw new Error("No CSRF token found");
    }
    const csrfToken = csrfCookie.split("=")[1].replace(/"/g, "");
    return csrfToken;
  }

  private getProfileDataFromResponse<TResponse extends Record<string, unknown>>(
    response: TResponse[],
    includes?: LinkedInProfileIncludes[]
  ): Record<LinkedInProfileIncludes, TResponse> | undefined {
    if (includes) {
      return includes.reduce((acc, include) => {
        return {
          ...acc,
          [include]: response.find(
            (x) => x["$type"] === this.dataKeyMap[include]
          ),
        };
      }, {} as Record<Partial<LinkedInProfileIncludes>, TResponse>);
    }
    const profile = response.find((x) => x["$type"] === this.profileDataKey);
    return {
      profile,
    } as Record<LinkedInProfileIncludes, TResponse>;
  }

  async getProfileByAlias(
    profileAlias: string,
    includes: LinkedInProfileIncludes[]
  ): Promise<Record<LinkedInProfileIncludes, LinkedInProfile>> {
    const data = await this.api.get<
      LinkedInPublicProfileResponse<LinkedInProfile>
    >(`${this.prefix}${profileAlias}${this.postfix}`);
    const response = this.getProfileDataFromResponse(
      data.data.included,
      includes
    );
    if (!response) {
      throw new Error("No profile data found");
    }
    return response;
  }
}

export const profileService = new LinkedInPublicProfileService();
