import css from "./arrow-box-right.css";
import html from "./arrow-box.html";

customElements.define('arrow-box-right',
    class extends HTMLElement {
        constructor() {
            super();
            const shadowRoot = this.attachShadow({ mode: 'open' })
            shadowRoot.innerHTML = `<style>${css}</style>${html}`;
        }
    }
);
