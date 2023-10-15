import axios from "axios";
import { LinkedInPublicProfileService } from "../linkedInProfile";
import { beforeEach, afterEach, expect, vi } from "vitest";
import { describe, it } from "node:test";

vi.mock("axios");

describe("LinkedInPublicProfileService", () => {
  let service: LinkedInPublicProfileService;

  beforeEach(() => {
    service = new LinkedInPublicProfileService();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getProfileByAlias", () => {
    it("should call the LinkedIn API with the correct URL", async () => {
      const getSpy = vi.spyOn(axios, "get").mockResolvedValueOnce({
        data: {
          included: [],
        },
      });
      await service.getProfileByAlias("test", []);
      expect(getSpy).toHaveBeenCalledWith(
        "https://www.linkedin.com/voyager/api/identity/dash/profiles?q=memberIdentity&memberIdentity=test&decorationId=com.linkedin.voyager.dash.deco.identity.profile.WebTopCardCore-22",
        expect.anything()
      );
    });

    it("should return the profile data if it exists", async () => {
      vi.spyOn(axios, "get").mockResolvedValueOnce({
        data: {
          included: [
            {
              $type: "com.linkedin.voyager.identity.profile.Profile",
              firstName: "John",
              lastName: "Doe",
            },
          ],
        },
      });
      const result = await service.getProfileByAlias("test", ["profile"]);
      expect(result).toEqual({
        profile: {
          $type: "com.linkedin.voyager.identity.profile.Profile",
          firstName: "John",
          lastName: "Doe",
        },
      });
    });

    it("should return the specified profile data if it exists", async () => {
      vi.spyOn(axios, "get").mockResolvedValueOnce({
        data: {
          included: [
            {
              $type: "com.linkedin.voyager.identity.profile.Profile",
              firstName: "John",
              lastName: "Doe",
            },
            {
              $type: "com.linkedin.voyager.identity.profile.Education",
              schoolName: "University of Test",
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
          $type: "com.linkedin.voyager.identity.profile.Profile",
          firstName: "John",
          lastName: "Doe",
        },
        education: {
          $type: "com.linkedin.voyager.identity.profile.Education",
          schoolName: "University of Test",
        },
      });
    });

    it("should throw an error if no profile data is found", async () => {
      vi.spyOn(axios, "get").mockResolvedValueOnce({
        data: {
          included: [],
        },
      });
      await expect(service.getProfileByAlias("test", [])).rejects.toThrow(
        "No profile data found"
      );
    });
  });
});
