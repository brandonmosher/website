import css from "./transform3d-container.css";
import html from "./transform3d-container.html";

customElements.define('transform3d-container',
    class extends HTMLElement {
        constructor() {
            super();
            const shadowRoot = this.attachShadow({ mode: 'open' })
            shadowRoot.innerHTML = `<style>${css}</style>${html}`;
        }
    }
);