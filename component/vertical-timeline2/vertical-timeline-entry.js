import { textToTemplate } from "Lib/textToTemplate";
import css from "./vertical-timeline-entry.css";
import html from "./vertical-timeline-entry.html";

const template = textToTemplate(css, html);

customElements.define('vertical-timeline-entry',
    class extends HTMLElement {
        constructor() {
            super();
            const shadowRoot = this.attachShadow({ mode: 'open' })
                .appendChild(template.content.cloneNode(true));
        }
    }
);