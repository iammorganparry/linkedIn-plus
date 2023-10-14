import React from "react";
import ReactDOM from "react-dom/client";
import "@webcomponents/custom-elements";
import css from "./index.css?inline";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ShadowRootEventHandler } from "./services/shadowRootEventHandler";
import { ContentMessenger } from "./services/content";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./routes";

const addStyles = (root: HTMLDivElement) => {
  root.setAttribute("id", "linkedInPlus");
  root.style.height = "600px";
  root.style.width = "400px";
  root.style.borderRadius = "10px";
  root.style.position = "fixed";
  root.style.top = "100px";
  root.style.right = "50px";
  root.style.zIndex = "9999";
};

class LinkedInPlus extends HTMLElement {
  private shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    const shadowRoot = this.shadow;
    const root = document.createElement("div");
    shadowRoot.appendChild(root);

    const queryClient = new QueryClient();
    const shadowRootEvents = new ShadowRootEventHandler();
    const contentMessenger = new ContentMessenger();
    contentMessenger.init();
    shadowRootEvents.listen();
    // remove all style from normal document

    addStyles(root);

    ReactDOM.createRoot(root, {
      identifierPrefix: "linkedInPlus",
    }).render(
      <React.StrictMode>
        <style type="text/css">{css}</style>/
        {/* <ClerkProvider
          publishableKey={
            "pk_test_cG9zaXRpdmUtdmlwZXItOTUuY2xlcmsuYWNjb3VudHMuZGV2JA"
          }
        > */}
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
        {/* </ClerkProvider> */}
      </React.StrictMode>
    );
  }
}

customElements.define("linked-in-plus", LinkedInPlus);
window.document.body.appendChild(document.createElement("linked-in-plus"));
