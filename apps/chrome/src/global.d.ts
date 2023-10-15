declare global {
  // opening up the namespace

  interface WindowEventMap {
    tabUpdated: CustomEvent<
      import("@linkedinplus/shared/types/messages").TabUpdatedPayload
    >;
  }
}
