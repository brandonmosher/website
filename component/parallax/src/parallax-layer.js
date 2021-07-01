import css from "./parallax-layer.css";
import html from "./parallax-layer.html";

customElements.define("parallax-layer",
    class extends HTMLElement {
        constructor() {
            super();
            const shadowRoot = this.attachShadow({ mode: "open" });
            shadowRoot.innerHTML = `<style>${css}</style>${html}`;
        }
    }
);
