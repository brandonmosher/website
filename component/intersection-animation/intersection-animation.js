import { OnIntersectionHTMLElement } from "Component/on-intersection/on-intersection.js"
import css from "./intersection-animation.css";
import html from "./intersection-animation.html";

function callback(entries, observer) {
    entries.forEach(entry => {
        if (entry.intersectionRatio >= entry.target.intersectionRatio) {
            entry.target.start();
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
        start() {
            this.animationChildren.forEach(animationChild => {
                if (this.animation) {
                    animationChild.style.animation = this.animation;
                }
                if (this.animationClass) {
                    animationChild.classList.add(this.animationClass);
                }
            });
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

        get animationClass() {
            return this.getAttribute("animation-class");
        }

        set animationClass(animationClass) {
            this.setAttribute("animation-class", animation);
        }
    }
);
