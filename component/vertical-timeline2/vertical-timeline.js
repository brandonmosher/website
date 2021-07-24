import { textToTemplate } from "Lib/textToTemplate";
import css from "./vertical-timeline.css";
import html from "./vertical-timeline.html";

const template = textToTemplate(css, html);

customElements.define('vertical-timeline',
    class extends HTMLElement {
        constructor() {
            super();
            const shadowRoot = this.attachShadow({ mode: 'open' })
                .appendChild(template.content.cloneNode(true));
        }
    }
);
