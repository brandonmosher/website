import { OnIntersectionHTMLElement } from "ComponentAbstract/on-intersection/on-intersection.js"
import css from "./intersection-transition.css";
import html from "./intersection-transition.html"
function parsePropertyNameValuePairsInitial(transitions) {
    return transitions
        .split(",")
        .map(transition => {
            const a = transition.split(" ");
            return [a[0], a[a.length - 2]];
        });
}

function parsePropertyNameValuePairsFinal(transitions) {
    return transitions
        .split(",")
        .map(transition => {
            const a = transition.split(" ");
            return [a[0], a[a.length - 1]];
        });
}

function parseTransitionStyle(transitions) {
    return transitions.split(",")
        .map(transition => transition.split(" ").slice(0, -2).join(" "))
        .join(",");
}

customElements.define("intersection-transition",
    class IntersectionTransitionHTMLElement extends OnIntersectionHTMLElement {
        static observedAttributeDefaults = {
            "intersection-ratio": 0.25,
            "transitions": ""
        }

        constructor() {
            super();
            const shadowRoot = this.attachShadow({ mode: "open" })
            shadowRoot.innerHTML = `<style>${css}</style>${html}`;
        }

        connectedCallback() {
            for (const [name, value] of Object.entries(IntersectionTransitionHTMLElement.observedAttributeDefaults)) {
                this.setAttribute(name, this.hasAttribute(name) ? this.getAttribute(name) : value);
            }
        }

        static get observedAttributes() { return Object.keys(IntersectionTransitionHTMLElement.observedAttributeDefaults); }

        get transitionChildren() {
            return Array.from(this.children);
        }

        set transitionPropertyNameValuePairs(transitionPropertyNameValuePairs) {
            this.transitionChildren.forEach(transitionChild => {
                transitionPropertyNameValuePairs.forEach(([name, value]) => {
                    transitionChild.style.setProperty(name, value);
                })
            });
        }

        set transitionStyle(transitionStyle) {
            this.transitionChildren.forEach(transitionChild => {
                transitionChild.style.transition = transitionStyle;
            });
        }

        get transitions() {
            return this.getAttribute("transitions");
        }

        set transitions(transitions) {
            this.transitionStyle = parseTransitionStyle(transitions);
            this.transitionPropertyNameValuePairs = parsePropertyNameValuePairsInitial(transitions);
        }

        attributeChangedCallback(name, oldValue, newValue) {
            switch (name) {
                case "intersection-ratio":
                    this.observe(IntersectionTransitionHTMLElement.callback, { "threshold": newValue });
                    break;
                case "transitions":
                    this.transitions = newValue;
                    break;
                default:
            }
        }

        static callback(entries, observer) {
            entries.forEach(entry => {
                const { target } = entry;
                if (entry.intersectionRatio >= target.getAttribute("intersection-ratio")) {
                    target.transitionPropertyNameValuePairs = parsePropertyNameValuePairsFinal(target.transitions);
                } else {
                    //do nothing?
                }
            });
        };
    }
);
