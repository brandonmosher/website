import css from "./vertical-timeline.css";
import html from "./vertical-timeline.html";

customElements.define('vertical-timeline',
    class extends HTMLElement {
        constructor() {
            super();
            const shadowRoot = this.attachShadow({ mode: 'open' })
            shadowRoot.innerHTML = `<style>${css}</style>${html}`;
        }
    }
);
