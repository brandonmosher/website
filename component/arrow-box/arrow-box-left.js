import { textToTemplate } from "Lib/textToTemplate";
import css from "./arrow-box-left.css";
import html from "./arrow-box.html";

const template = textToTemplate(css, html);

customElements.define('arrow-box-left',
    class extends HTMLElement {
        constructor() {
            super();
            const shadowRoot = this.attachShadow({ mode: 'open' })
                .appendChild(template.content.cloneNode(true));
        }
    }
);
