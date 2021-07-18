import { textToTemplate } from "Lib/textToTemplate";
import css from "./tinted-background.css";
import html from "./tinted-background.html";

const template = textToTemplate(css, html);

customElements.define("tinted-background",
    class extends HTMLElement {
        constructor() {
            super();
            const shadowRoot = this.attachShadow({ mode: 'open' })
                .appendChild(template.content.cloneNode(true));
        }
    }
);
