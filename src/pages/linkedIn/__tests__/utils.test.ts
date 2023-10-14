import { describe, expect, it } from "vitest";
import { getLinkedInAlias } from "../utils";

describe("getLinkedInAlias", () => {
  it("returns the LinkedIn alias", () => {
    const url = "https://www.linkedin.com/in/iammorganparry/";
    const alias = getLinkedInAlias(url);
    expect(alias).toBe("iammorganparry");
  });

  it("returns undefined if no alias is found", () => {
    const url = "https://www.linkedin.com/";
    const alias = getLinkedInAlias(url);
    expect(alias).toBe(undefined);
  });
});
