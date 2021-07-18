import { IntersectionObserverPool } from 'Lib/intersectionObserverPool/intersectionObserverPool.js'

function HTMLToCamelCase(s) {
    return s.replace(/-([a-z])/g, g => g[1].toUpperCase());
}

function camelToHTMLCase(s) {
    return s.replace(/([a-z][A-Z])/g, g => g[0] + '-' + g[1].toLowerCase());
}

export class OnIntersectionHTMLElement extends HTMLElement {
    _callback = null;

    constructor(callback, optionDefaults = {}) {
        super();
        this.observe(callback, {...optionDefaults, ...this.options});
    }

    get isObserved() {
        return !!this._callback;
    }

    observe(callback, options = null) {
        this.unobserve();
        this._callback = callback;
        if (options) {
            Object.entries(options).forEach(([kCamelCase, v]) => {
                const kHTMLCase = camelToHTMLCase(kCamelCase);
                if (OnIntersectionHTMLElement.observedAttributes.includes(kHTMLCase)) {
                    this[kCamelCase] = v;
                }
            });
        }
        IntersectionObserverPool.observe(this, callback, this.options);
    }

    unobserve() {
        if (this.isObserved) {
            IntersectionObserverPool.unobserve(this, this._callback, this.options);
            this._callback = null;
        }
    }

    set threshold(threshold) { this.setAttribute('threshold', JSON.stringify(threshold)); }

    get threshold() { return JSON.parse(this.getAttribute('threshold')); }

    set rootMargin(rootMargin) { this.setAttribute('root-margin', rootMargin); }

    get rootMargin() { return this.getAttribute('root-margin'); }

    set root(root) { this.setAttribute('root', root); }

    get root() { return document.querySelector(this.getAttribute('root')); }

    get callback() {
        return this._callback;
    }

    get options() {
        return OnIntersectionHTMLElement.observedAttributes
            .map(HTMLToCamelCase)
            .reduce((options, attrName) => {
                if (this[attrName]) {
                    options[attrName] = this[attrName];
                }
                return options;
            }, {});
    }

    static observedAttributes = ['threshold', 'root', 'root-margin'];

    attributeChangedCallback(attrName, oldValue, newValue) {
        if (this.isObserved && oldValue !== newValue) {
            const oldOptions = oldValue ? { ...this.options, [HTMLToCamelCase(attrName)]: oldValue } : this.options;
            IntersectionObserverPool.unobserve(this, this._callback, oldOptions);
            this.observe(this._callback);
        }
    }
}