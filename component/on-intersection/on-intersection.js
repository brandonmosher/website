import { IntersectionObserverPool } from "Lib/intersectionObserverPool/intersectionObserverPool.js"

export class OnIntersectionHTMLElement extends HTMLElement {
    callback = null;
    options = {};

    observe(callback, options) {
        this.unobserve();
        IntersectionObserverPool.observe(this, callback, options);
        this.callback = callback;
        this.options = options;
    }

    unobserve() {
        IntersectionObserverPool.unobserve(this, this.callback, this.options);
        this.callback = null;
        this.options = {};
    }
}
