import { importCSSHTML } from "/lib/importCSSHTML/importCSSHTML.js"

importCSSHTML(
    "/component/tinted-background/tinted-background.css",
    "/component/tinted-background/tinted-background.html")
.then(shadowRootContent => {
    customElements.define("tinted-background",
        class extends HTMLElement {
            constructor() {
                super();
                const shadowRoot = this.attachShadow({mode: "open"});
                shadowRoot.innerHTML = shadowRootContent;
            }
        }
    );
});
