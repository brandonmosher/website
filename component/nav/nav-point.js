import { OnIntersectionHTMLElement } from "Component/on-intersection/on-intersection.js"

function callback(entries, observer) {
    entries.forEach(entry => {
        const { target } = entry;
        if (entry.intersectionRatio >= target.intersectionRatio) {
            window.location.hash = target.id;
        }
    })
}


customElements.define('nav-point',
    class extends OnIntersectionHTMLElement {
        constructor() {
            super(callback, { 'threshold': 0.5 });
        }
    }
);