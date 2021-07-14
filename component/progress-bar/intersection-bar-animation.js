import { OnIntersectionHTMLElement } from "Component/on-intersection/on-intersection.js"

function AnimateProgressBarFactory(bar, end) {
    let i = 0;
    return function animate() {
        if(i < end) {
            bar.style.setProperty('--bar-completed-percentage', i);
            ++i;
            requestAnimationFrame(animate);
        }
    }
}

function callback(entries, observer) {
    entries.forEach(entry => {
        const { target } = entry;
        if (entry.intersectionRatio >= target.intersectionRatio) {
            AnimateProgressBarFactory(target.children[0], parseInt(target.getAttribute('end')))();
        }
    });
};

customElements.define("intersection-bar-animation",
    class extends OnIntersectionHTMLElement {
        constructor() {
            super(callback);
            const shadowRoot = this.attachShadow({ mode: "open" })
            shadowRoot.innerHTML = `<slot></slot>`;
        }
    }
);

