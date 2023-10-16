declare global {
  // opening up the namespace

  interface WindowEventMap {
    tabUpdated: CustomEvent<
      import("@linkedinplus/shared/types/messages").TabUpdatedPayload
    >;
  }

  interface HTMLElementEventMap
    extends ElementEventMap,
      GlobalEventHandlersEventMap {
    openMessageModal: CustomEvent<null>;
  }
}
