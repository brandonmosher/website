import css from "./arrow-box-left.css";
import html from "./arrow-box.html";

customElements.define('arrow-box-left',
    class extends HTMLElement {
        constructor() {
            super();
            const shadowRoot = this.attachShadow({ mode: 'open' })
            shadowRoot.innerHTML = `<style>${css}</style>${html}`;
        }
    }
);
