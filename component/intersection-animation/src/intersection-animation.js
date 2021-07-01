import { OnIntersectionHTMLElement } from "ComponentAbstract/on-intersection/on-intersection.js"
import css from "./intersection-animation.css";
import html from "./intersection-animation.html";

customElements.define("intersection-animation",
    class IntersectionAnimationHTMLElement extends OnIntersectionHTMLElement {
        static observedAttributeDefaults = {
            "intersection-ratio": 0.25,
            "animation": "",
        }

        constructor() {
            super();
            const shadowRoot = this.attachShadow({ mode: "open" })
            shadowRoot.innerHTML = `<style>${css}</style>${html}`;
        }

        connectedCallback() {
            for (const [name, value] of Object.entries(IntersectionAnimationHTMLElement.observedAttributeDefaults)) {
                this.setAttribute(name, this.hasAttribute(name) ? this.getAttribute(name) : value);
            }
        }

        static get observedAttributes() { return Object.keys(IntersectionAnimationHTMLElement.observedAttributeDefaults); }

        get animationChildren() {
            return Array.from(this.children);
        }

        get animation() {
            return this.getAttribute("animation");
        }

        set animation(animation) {
            this.setAttribute("animation", animation);
        }

        attributeChangedCallback(name, oldValue, newValue) {
            switch (name) {
                case "intersection-ratio":
                    this.observe(IntersectionAnimationHTMLElement.callback, { "threshold": newValue });
                    break;
                default:
            }
        }

        static callback(entries, observer) {
            entries.forEach(entry => {
                const { target } = entry;
                if (entry.intersectionRatio >= target.getAttribute("intersection-ratio")) {
                    target.animationChildren.forEach(animationChild => {
                        animationChild.style.animation = target.animation;
                    });
                } else {
                    //do nothing?
                }
            });
        };
    }
);
