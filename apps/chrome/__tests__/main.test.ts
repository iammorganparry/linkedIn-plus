import { JSDOM } from "jsdom";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { LinkedInPlus } from "../src/main";
describe("LinkedInPlus", () => {
  let dom: JSDOM;

  beforeEach(() => {
    dom = new JSDOM("<html><body></body></html>");
    global.document = dom.window.document;
  });

  afterEach(() => {
    dom.window.close();
  });

  it("should render the LinkedInPlus component", async () => {
    customElements.define("linked-in-plus", LinkedInPlus);
    const element = document.createElement("linked-in-plus") as LinkedInPlus;
    document.body.appendChild(element);
    expect(element.shadowRoot).toBeDefined();
    // get the element in the dom
    const elementInDom = document.querySelector("linked-in-plus");
    expect(elementInDom).toBeDefined();

    const iframe = document.querySelector("iframe");
    expect(iframe).toBeDefined();
  });
});
