import { OnIntersectionHTMLElement } from 'Component/on-intersection/on-intersection.js'
import css from './on-intersection-add-class.css';
import html from './on-intersection-add-class.html';

function callback(entries, observer) {
    entries.forEach(entry => {
        if (entry.intersectionRatio >= entry.target.intersectionRatio) {
            entry.target.addIntersectionClass();
        }
    });
};

customElements.define('on-intersection-add-class',
    class extends OnIntersectionHTMLElement {
        constructor() {
            super(callback);
            const shadowRoot = this.attachShadow({ mode: 'open' })
            shadowRoot.innerHTML = `<style>${css}</style>${html}`;
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
