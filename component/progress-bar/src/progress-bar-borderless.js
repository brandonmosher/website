import css from "./progress-bar-borderless.css";
import html from "./progress-bar.html";

customElements.define("progress-bar-borderless",
    class extends HTMLElement {
        constructor() {
            super();
            const shadowRoot = this.attachShadow({ mode: "open" });
            shadowRoot.innerHTML = `<style>${css}</style>${html}`;
        }
    }
);