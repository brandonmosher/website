import css from "./vertical-timeline-entry.css";
import html from "./vertical-timeline-entry.html";

customElements.define('vertical-timeline-entry',
    class extends HTMLElement {
        constructor() {
            super();
            const shadowRoot = this.attachShadow({ mode: 'open' })
            shadowRoot.innerHTML = `<style>${css}</style>${html}`;
        }
    }
);