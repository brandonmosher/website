import { textToTemplate } from "Lib/textToTemplate";
import css from './contact-form.css';
import html from './contact-form.html';

const template = textToTemplate(css, html);

customElements.define('contact-form',
    class extends HTMLElement {
        static observedAttributes = [
            'accept-charset',
            'action',
            'autocomplete',
            'enctype',
            'method',
            'name',
            'novalidate',
            'target',
        ];

        constructor() {
            super();
            const shadowRoot = this.attachShadow({ mode: 'open' })
                .appendChild(template.content.cloneNode(true));
            this.form = this.shadowRoot.querySelector("form");
        }

        attributeChangedCallback(attrName, oldValue, newValue) {
            this.form.setAttribute(attrName, newValue);
        }
    }
);