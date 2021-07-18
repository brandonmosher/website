import { textToTemplate } from "Lib/textToTemplate";
import css from "./transform3d-container.css";
import html from "./transform3d-container.html";

const template = textToTemplate(css, html);

customElements.define('transform3d-container',
    class extends HTMLElement {
        constructor() {
            super();
            const shadowRoot = this.attachShadow({ mode: 'open' })
                .appendChild(template.content.cloneNode(true));
        }
    }
);