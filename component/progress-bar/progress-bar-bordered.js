import { textToTemplate } from "Lib/textToTemplate";
import css from "./progress-bar-bordered.css";
import html from "./progress-bar.html";

const template = textToTemplate(css, html);

customElements.define("progress-bar-bordered",
    class extends HTMLElement {
        constructor() {
            super();
            const shadowRoot = this.attachShadow({ mode: 'open' })
                .appendChild(template.content.cloneNode(true));
        }
    }
);