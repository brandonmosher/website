import css from "./fixed-background.css";
import html from "./fixed-background.html";

customElements.define('fixed-background',
    class extends HTMLElement {
        constructor() {
            super();
            const shadowRoot = this.attachShadow({ mode: 'open' })
            shadowRoot.innerHTML = `<style>${css}</style>${html}`;
        }
    }
);