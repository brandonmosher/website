import css from "./nav-entry.css";
import html from "./nav-entry.html";

customElements.define('nav-entry',
    class extends HTMLElement {
        constructor() {
            super();
            const shadowRoot = this.attachShadow({ mode: 'open' });
            shadowRoot.innerHTML = `<style>${css}</style>${html}`;
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
            this.shadowRoot.querySelector("a").setAttribute("href", href);
        }

        get href() {
            return this.shadowRoot.querySelector("a").getAttribute("href");
        }

        updateActive() {
            this.classList.toggle((this.href === window.location.href) || (this.href === window.location.hash));
        }
    }
);