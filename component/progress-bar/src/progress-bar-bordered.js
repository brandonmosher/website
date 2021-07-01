import css from "./progress-bar-bordered.css";
import html from "./progress-bar.html";

customElements.define("progress-bar-bordered",
    class extends HTMLElement {
        constructor() {
            super();
            const shadowRoot = this.attachShadow({ mode: "open" });
            shadowRoot.innerHTML = `<style>${css}</style>${html}`;
        }
    }
);