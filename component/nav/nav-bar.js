import css from "./nav-bar.css";
import html from "./nav-bar.html";

customElements.define('nav-bar',
    class extends HTMLElement {
        constructor() {
            super();
            const shadowRoot = this.attachShadow({ mode: 'open' });
            shadowRoot.innerHTML = `<style>${css}</style>${html}`;
            this.updateActive();
            window.addEventListener("hashchange", e => { this.updateActive()});
        }

        updateActive() {
            this.querySelectorAll("nav-entry").forEach(e => {
                e.updateActive();
            });
        }
    }
);