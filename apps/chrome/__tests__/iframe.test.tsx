import React from "react";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ShadowRootMessageHandler } from "../src/services/shadowRootMessageHandler";
import { LinkedInPublicProfileService } from "../src/services/linkedInProfile";
import { Iframe } from "../src/iframe";

describe("Iframe", () => {
  let messenger: ShadowRootMessageHandler;

  beforeEach(() => {
    const profileService = {
      getProfile: vi.fn(),
    } as unknown as LinkedInPublicProfileService;
    messenger = new ShadowRootMessageHandler(profileService);
    render(<Iframe messenger={messenger} />);
  });

  afterEach(cleanup);

  it("should render the iframe", () => {
    const iframe = screen.getByTestId("iframe");
    expect(iframe).toBeInTheDocument();
  });

  it("should be draggable", async () => {
    const iframe = await screen.findByTestId("iframe");
    expect(iframe).toBeInTheDocument();

    const dragHandle = await screen.findByTestId("drag-handle");
    expect(dragHandle).toBeInTheDocument();

    await act(async () => {
      await fireEvent.mouseDown(dragHandle, { clientX: 100, clientY: 100 });
      await fireEvent.mouseMove(dragHandle, { clientX: 200, clientY: 200 });
      await fireEvent.mouseUp(dragHandle, { clientX: 200, clientY: 200 });
    });
  });
});
