import { IntersectionObserverPool } from "Lib/intersectionObserverPool/intersectionObserverPool.js"

export class OnIntersectionHTMLElement extends HTMLElement {
    callback = null;
    options = null;

    constructor(callback, options = {}) {
        super();
        this.observe(callback, options);
    }

    get isObserved() {
        return !!this.callback && !!this.options;
    }

    observe(callback, options) {
        if (this.isObserved) {
            this.unobserve();
        }
        if (options.hasOwnProperty('threshold')) {
            this.intersectionRatio = options['threshold'];
        }
        else {
            options['threshold'] = this.intersectionRatio;
        }
        this.callback = callback;
        this.options = options;
        IntersectionObserverPool.observe(this, callback, options);
    }

    unobserve() {
        if (!this.isObserved) {
            IntersectionObserverPool.unobserve(this, this.callback, this.options);
            this.callback = null;
            this.options = null;
        }
    }

    set intersectionRatio(intersectionRatio) {
        this.setAttribute("threshold", intersectionRatio);
        if(this.isObserved) {
            this.observe(this.callback, { ...this.options, 'threshold': parseFloat(intersectionRatio) });
        }
    }

    get intersectionRatio() {
        if(this.hasAttribute("intersection-ratio")) {
            return parseFloat(this.getAttribute("intersection-ratio"));
        }
        return 0.25;
    }

    static get observedAttributes() {
        return ['intersection-ratio'];
    }

    attributeChangedCallback(attrName, oldValue, newValue) {
        if (oldValue === newValue) {
            return;
        }
        switch (name) {
            case "intersection-ratio":
                this.intersectionRatio = newValue;
                break;
            default:
                break;
        }
    }
}
