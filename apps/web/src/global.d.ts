declare global {
  // opening up the namespace
  declare global {
    interface WindowEventHandlersEventMap {
      message: MessageEvent<
        import("@linkedinplus/shared/types/messages").AppMessageEvents
      >;
    }
    interface WindowEventMap {
      tabUpdated: CustomEvent<
        import("@linkedinplus/shared/types/messages").TabUpdatedPayload
      >;
    }
  }
}
