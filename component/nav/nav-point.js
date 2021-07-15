import { OnIntersectionHTMLElement } from "Component/on-intersection/on-intersection.js"

function callback(entries, observer) {
    entries.forEach(entry => {
        if(entry.intersectionRatio < 1) {
            return;
        }
        const hash = entry.target.id;
        console.log("Replace State", hash, entry.intersectionRatio);
        history.replaceState({}, '', `#${hash}`);
        const currentActive = document.querySelector(`nav-entry.active`);
        const futureActive = document.querySelector(`nav-entry[href=\\#${hash}]`);
        if(currentActive) {
            currentActive.classList.remove('active');
        }
        if(futureActive) {
            futureActive.classList.add('active');
        }
    })
}


customElements.define('nav-point',
    class extends OnIntersectionHTMLElement {
        constructor() {
            super(callback, {
                'threshold': 1,
                'rootMargin': "0px 0px -50% 0px"
            });
        }
    }
);