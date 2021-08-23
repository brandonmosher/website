import css from "./nav-section.css";
import html from "./nav-section.html";
import { OnIntersectionHTMLElement } from "Component/on-intersection/on-intersection.js"

function callback(entries, observer) {
    entries.forEach(entry => {
        if (entry.intersectionRatio > 0) {
            const hash = `#${entry.target.id}`;
            if(hash !== window.location.hash) {
                history.replaceState({}, '', hash);
            }
            const currentActive = document.querySelector(`nav-entry.active`);
            const futureActive = document.querySelector(`nav-entry[href=\\${hash}]`);
            if (currentActive) {
                currentActive.classList.remove('active');
            }
            if (futureActive) {
                futureActive.classList.add('active');
            }
        }
    });
}


customElements.define('nav-section',
    class extends OnIntersectionHTMLElement {
        constructor() {
            super(callback, {
                'threshold': 0.6
            });
            const shadowRoot = this.attachShadow({ mode: 'open' });
            shadowRoot.innerHTML = `<style>${css}</style>${html}`;
        }
    }
);