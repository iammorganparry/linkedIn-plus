export enum IncludedTypes {
  LinkedInProfile = "com.linkedin.voyager.dash.identity.profile.Profile",
  LinkedInPosition = "com.linkedin.voyager.dash.identity.profile.Position",
  LinkedInEducation = "com.linkedin.voyager.dash.identity.profile.Education",
}
type BaseInclude = {
  $type: IncludedTypes;
};

type LIImage = {
  displayImageReference: {
    vectorImage: {
      rootUrl: string;
      artifacts: {
        width: number;
        height: number;
        fileIdentifyingUrlPathSegment: string;
      }[];
    };
  };
};
export type LinkedInProfile = BaseInclude & {
  firstName: string;
  lastName: string;
  publicIdentifier: string;
  headline: string;
  backgroundPicture: LIImage;
  profilePicture: LIImage;
};

export type LinkedInProfileIncludes = "position" | "education" | "profile";
