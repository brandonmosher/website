import {textToTemplate} from "Lib/textToTemplate";
import css from "./git-container.css";
import html from "./git-container.html";

const template = textToTemplate(css, html);

customElements.define('git-container',
    class extends HTMLElement {
        constructor() {
            super();
            const shadowRoot = this.attachShadow({ mode: 'open' })
                .appendChild(template.content.cloneNode(true));
        }
    }
);