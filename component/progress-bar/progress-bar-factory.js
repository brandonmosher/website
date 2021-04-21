import { importCSSHTML } from "/lib/importCSSHTML/importCSSHTML.js"

export function ProgressBarFactory(tagName, CSSPath, HTMLPath) {
    importCSSHTML(
        CSSPath,
        HTMLPath)
    .then(shadowRootContent => {
        customElements.define(tagName,
            class extends HTMLElement {
        
                static get observedAttributes() { return ["style"]; }
        
                constructor() {
                    super();
                    const shadowRoot = this.attachShadow({mode: "open"});
                    shadowRoot.innerHTML = shadowRootContent;
                }
        
                attributeChangedCallback(name, oldValue, newValue) {
                    switch(name) {
                        case "style":
                            this.shadowRoot.getElementById("label-right").textContent = this.style.getPropertyValue("--bar-completed-percentage");
                            break;
                        default:
                            break;
                    }
                }
            }
        );
    });
}

