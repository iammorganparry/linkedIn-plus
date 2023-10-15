import axios from "axios";
import { LinkedInPublicProfileService } from "../linkedInProfile";
import { afterEach, expect, vi, it, describe, beforeEach } from "vitest";
import { createLinkedInProfileResponse } from "../../../__tests__/utils";
import { IncludedTypes } from "@linkedinplus/shared";
// //TODO: move this to global mock
vi.mock("axios", async () => {
  const actual = (await vi.importActual("axios")) as {
    create: () => typeof axios;
  };
  return {
    ...actual,
    create: () => ({
      get: vi.fn(),
    }),
    get: vi.fn(),
  };
});

vi.mock("js-cookie", async () => {
  const actual = (await vi.importActual("js-cookie")) as {
    get: (name: string) => string | undefined;
  };
  return {
    ...actual,
    get: vi.fn().mockReturnValue("JSESSIONID=123"),
  };
});

describe("LinkedInPublicProfileService", () => {
  let service: LinkedInPublicProfileService;
  afterEach(() => {
    vi.resetAllMocks();
  });

  beforeEach(() => {
    service = new LinkedInPublicProfileService();
  });

  describe("getProfileByAlias", () => {
    it("should call the LinkedIn API with the correct URL", async () => {
      // @ts-expect-error - Private var
      const getSpy = vi.spyOn(service.api, "get").mockResolvedValueOnce({
        data: {
          included: [],
        },
      });
      await service.getProfileByAlias("test", ["profile"]);
      expect(getSpy).toHaveBeenCalledWith(
        "/voyager/api/identity/dash/profiles?q=memberIdentity&memberIdentity=test&decorationId=com.linkedin.voyager.dash.deco.identity.profile.WebTopCardCore-22"
      );
    });

    it("should return the profile data if it exists", async () => {
      // @ts-expect-error - Private var
      vi.spyOn(service.api, "get").mockResolvedValueOnce({
        data: {
          included: [
            {
              $type: IncludedTypes.LinkedInProfile,
              firstName: "John",
              lastName: "Doe",
            },
          ],
        },
      });
      const result = await service.getProfileByAlias("test", ["profile"]);
      expect(result).toEqual({
        profile: {
          $type: IncludedTypes.LinkedInProfile,
          firstName: "John",
          lastName: "Doe",
        },
      });
    });

    it("should return the specified profile data if it exists", async () => {
      // @ts-expect-error - Private var
      vi.spyOn(service.api, "get").mockResolvedValueOnce({
        data: {
          included: [
            {
              ...createLinkedInProfileResponse(),
              $type: IncludedTypes.LinkedInProfile,
            },
            {
              $type: IncludedTypes.LinkedInEducation,
            },
          ],
        },
      });
      const result = await service.getProfileByAlias("test", [
        "profile",
        "education",
      ]);
      expect(result).toEqual({
        profile: {
          ...createLinkedInProfileResponse(),
          $type: IncludedTypes.LinkedInProfile,
        },
        education: {
          $type: IncludedTypes.LinkedInEducation,
        },
      });
    });

    it("should throw an error if no profile data is found", async () => {
      // @ts-expect-error - Private var
      vi.spyOn(service.api, "get").mockResolvedValueOnce({
        data: {
          included: [],
        },
      });
      try {
        await service.getProfileByAlias("test", []);
      } catch (error) {
        expect(error).toEqual(new Error("No profile data found"));
      }
    });
  });
});
