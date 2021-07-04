import { OnIntersectionHTMLElement } from "Component/on-intersection/on-intersection.js"
import css from "./intersection-animation.css";
import html from "./intersection-animation.html";

function callback(entries, observer) {
    entries.forEach(entry => {
        const { target } = entry;
        if (entry.intersectionRatio >= target.intersectionRatio) {
            target.animationChildren.forEach(animationChild => {
                animationChild.style.animation = target.animation;
            });
        }
    });
};

customElements.define("intersection-animation",
    class extends OnIntersectionHTMLElement {
        constructor() {
            super(callback);
            const shadowRoot = this.attachShadow({ mode: "open" })
            shadowRoot.innerHTML = `<style>${css}</style>${html}`;
        }

        connectedCallback() {
            if(!this.hasAttribute("animation")) {
                this.setAttribute("animation", "");
            }
        }

        get animationChildren() {
            return Array.from(this.children);
        }

        get animation() {
            return this.getAttribute("animation");
        }

        set animation(animation) {
            this.setAttribute("animation", animation);
        }
    }
);
