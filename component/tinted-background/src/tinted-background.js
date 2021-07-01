import css from "./tinted-background.css";
import html from "./tinted-background.html";

customElements.define("tinted-background",
    class extends HTMLElement {
        constructor() {
            super();
            const shadowRoot = this.attachShadow({ mode: "open" });
            shadowRoot.innerHTML = `<style>${css}</style>${html}`;
        }
    }
);
