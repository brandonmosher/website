import {textToTemplate} from "Lib/textToTemplate";
import css from "./fixed-background.css";
import html from "./fixed-background.html";

const template = textToTemplate(css, html);

customElements.define('fixed-background',
    class extends HTMLElement {
        constructor() {
            super();
            const shadowRoot = this.attachShadow({ mode: 'open' })
                .appendChild(template.content.cloneNode(true));
        }
    }
);