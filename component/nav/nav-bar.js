import { textToTemplate } from "Lib/textToTemplate";
import css from "./nav-bar.css";
import html from "./nav-bar.html";

const template = textToTemplate(css, html);

customElements.define('nav-bar',
    class extends HTMLElement {
        constructor() {
            super();
            const shadowRoot = this.attachShadow({ mode: 'open' })
                .appendChild(template.content.cloneNode(true));
            this.updateActive();
            window.addEventListener("hashchange", e => { this.updateActive() });
        }

        updateActive() {
            this.querySelectorAll("nav-entry").forEach(e => {
                e.updateActive();
            });
        }
    }
);