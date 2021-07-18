import { textToTemplate } from "Lib/textToTemplate";
import css from "./parallax-layer.css";
import html from "./parallax-layer.html";

const template = textToTemplate(css, html);

customElements.define("parallax-layer",
    class extends HTMLElement {
        constructor() {
            super();
            const shadowRoot = this.attachShadow({ mode: 'open' })
                .appendChild(template.content.cloneNode(true));
        }
    }
);
