import { OnIntersectionHTMLElement } from 'Component/on-intersection/on-intersection.js'
import { textToTemplate } from "Lib/textToTemplate";
import css from './on-intersection-add-class.css';
import html from './on-intersection-add-class.html';

const template = textToTemplate(css, html);

function callback(entries, observer) {
    entries.forEach(entry => {
        if (entry.intersectionRatio > 0) {
            entry.target.addIntersectionClass();
        }
    });
};

customElements.define('on-intersection-add-class',
    class extends OnIntersectionHTMLElement {
        constructor() {
            super(callback, { 'threshold': 0.25 });
            const shadowRoot = this.attachShadow({ mode: 'open' })
                .appendChild(template.content.cloneNode(true));
        }

        addIntersectionClass() {
            Array.from(this.children).forEach(child => {
                child.classList.add(this.intersectionClass);
            });
        }

        get intersectionClass() {
            return this.getAttribute('intersection-class');
        }

        set intersectionClass(intersectionClass) {
            this.setAttribute('intersection-class', intersectionClass);
        }
    }
);
