import { textToTemplate } from "Lib/textToTemplate";
import css from "./nav-entry.css";
import html from "./nav-entry.html";

const template = textToTemplate(css, html);

customElements.define('nav-entry',
    class extends HTMLElement {
        constructor() {
            super();
            const shadowRoot = this.attachShadow({ mode: 'open' })
                .appendChild(template.content.cloneNode(true));
            this.anchor = this.shadowRoot.querySelector("a");
        }
        static get observedAttributes() {
            return ['href'];
        }
        attributeChangedCallback(attrName, oldVal, newVal) {
            switch (attrName) {
                case "href":
                    this.href = newVal;
                    break;
                default:
            }
        }

        set href(href) {
            this.anchor.setAttribute("href", href);
        }

        get href() {
            return this.anchor.getAttribute("href");
        }

        get hash() {
            return this.anchor.getAttribute("hash");
        }

        updateActive() {
            this.classList.toggle('active', (this.href === window.location.href) || (this.href === window.location.hash));
        }
    }
);