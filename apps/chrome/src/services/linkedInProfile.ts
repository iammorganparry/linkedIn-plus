import {
  IncludedTypes,
  type LinkedInProfile,
  type LinkedInProfileIncludes,
} from "@linkedinplus/shared";
import axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";

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
      education: IncludedTypes.LinkedInEducation,
      position: IncludedTypes.LinkedInPosition,
    };
  }

  public csrfToken(): string {
    const csrfCookie = Cookies.get("JSESSIONID");
    // if (!csrfCookie) {
    //   //TODO: Figure out how to bloody test this
    //   throw new Error("No CSRF token found");
    // }
    return csrfCookie ?? "";
  }

  private getProfileDataFromResponse<
    TResponse extends Record<string, unknown>,
    TIncludes extends LinkedInProfileIncludes
  >(response: TResponse[], includes?: TIncludes[]) {
    if (includes) {
      console.log("includes", includes);
      return includes.reduce((acc, include) => {
        console.log("include", include, this.dataKeyMap[include]);
        return {
          ...acc,
          [include]: response.find(
            (x) => x["$type"] === this.dataKeyMap[include]
          ),
        };
      }, {} as Record<Extract<LinkedInProfileIncludes, TIncludes>, TResponse>);
    }
    const profile = response.find((x) => x["$type"] === this.profileDataKey);
    return {
      profile,
    } as Record<Extract<LinkedInProfileIncludes, "profile">, TResponse>;
  }

  async getProfileByAlias<TIncludes extends LinkedInProfileIncludes>(
    profileAlias: string,
    includes: TIncludes[]
  ) {
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
