import { importCSSHTML } from "/lib/importCSSHTML/importCSSHTML.js"

export function ProgressBarFactory(tagName, CSSPath, HTMLPath) {
    importCSSHTML(
        CSSPath,
        HTMLPath)
    .then(shadowRootContent => {
        customElements.define(tagName,
            class extends HTMLElement {
                constructor() {
                    super();
                    const shadowRoot = this.attachShadow({mode: "open"});
                    shadowRoot.innerHTML = shadowRootContent;
                }
            }
        );
    });
}

