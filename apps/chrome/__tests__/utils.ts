import { IncludedTypes, LinkedInProfile } from "@linkedinplus/shared";

export const createLinkedInProfileResponse = (): LinkedInProfile => ({
  $type: IncludedTypes.LinkedInProfile,
  firstName: "John",
  lastName: "Doe",
  headline: "Test Headline",
  profilePicture: {
    displayImageReference: {
      vectorImage: {
        rootUrl: "https://example.com",
        artifacts: [
          {
            width: 100,
            height: 100,
            fileIdentifyingUrlPathSegment: "test",
          },
        ],
      },
    },
  },
  publicIdentifier: "test",
  backgroundPicture: {
    displayImageReference: {
      vectorImage: {
        rootUrl: "https://example.com",
        artifacts: [
          {
            width: 100,
            height: 100,
            fileIdentifyingUrlPathSegment: "test",
          },
        ],
      },
    },
  },
});
