import { textToTemplate } from "Lib/textToTemplate";
import css from "./progress-bar-borderless.css";
import html from "./progress-bar.html";

const template = textToTemplate(css, html);

customElements.define("progress-bar-borderless",
    class extends HTMLElement {
        constructor() {
            super();
            const shadowRoot = this.attachShadow({ mode: 'open' })
                .appendChild(template.content.cloneNode(true));
        }
    }
);