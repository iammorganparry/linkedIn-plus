import React from "react";
import ReactDOM from "react-dom/client";
import "@webcomponents/custom-elements";
import css from "./index.css?inline";
import { ShadowRootEventHandler } from "./services/shadowRootEventHandler";
import { ContentMessenger } from "./services/content";
import { Iframe } from "./iframe";
import { profileService } from "./services/linkedInProfile";

export class LinkedInPlus extends HTMLElement {
  private shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    const shadowRoot = this.shadow;
    const root = document.createElement("div");
    shadowRoot.appendChild(root);

    const contentMessenger = new ContentMessenger();
    contentMessenger.init();
    const iframeMessenger = new ShadowRootEventHandler(profileService);
    iframeMessenger.listen();

    ReactDOM.createRoot(root, {
      identifierPrefix: "linkedInPlus",
    }).render(
      <React.StrictMode>
        <style type="text/css">{css}</style>
        <Iframe messenger={iframeMessenger} />
      </React.StrictMode>
    );
  }
}

customElements.define("linked-in-plus", LinkedInPlus);
window.document.body.appendChild(document.createElement("linked-in-plus"));
