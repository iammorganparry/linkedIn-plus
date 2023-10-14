declare global {
  // opening up the namespace

  declare global {
    interface WindowEventMap {
      tabUpdated: CustomEvent<import("./messages").TabUpdatedPayload>;
    }
  }
}
