declare global {
  // opening up the namespace

  interface WindowEventMap {
    tabUpdated: CustomEvent<import("./messages").TabUpdatedPayload>;
  }
}
