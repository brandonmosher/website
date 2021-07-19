"use strict";

class IntersectionObserverState {
    callback = null;
    observer = null;
    entryCount = 0;
    constructor(callback, options) {
        this.callback = callback;
        this.observer = new IntersectionObserver(callback, options);
    }

    get options() {
        return {
            root: this.observer.root,
            rootMargin: this.observer.rootMargin,
            threshold: this.observer.thresholds
        }
    }

    observe(targetElement) {
        this.observer.observe(targetElement);
        ++this.entryCount;
    }

    unobserve(targetElement) {
        this.observer.unobserve(targetElement);
        --this.entryCount;
    }

    matches(callback, options) {
        if (callback !== this.callback) {
            return false;
        }
        return JSON.stringify(options) === JSON.stringify(this.options);
    }
}

export class IntersectionObserverPool {
    static intersectionObserverStates = [];

    static normalizedOptions(options) {
        const defaultOptions = {
            root: null,
            rootMargin: "0px",
            threshold: [0]
        };

        if ("threshold" in options && !Array.isArray(options.threshold)) {
            options.threshold = [options.threshold];
        }
        if ("rootMargin" in options) {
            const s = new Set(options["rootMargin"].split(" "));
            if (s.length == 1 && s.has("0px")) {
                options['rootMargin'] = "0px";
            }
        }

        return { ...defaultOptions, ...options };
    }

    static getIntersectionObserverStateIndex(callback, options) {
        for (let i = 0; i < IntersectionObserverPool.intersectionObserverStates.length; ++i) {
            if (IntersectionObserverPool.intersectionObserverStates[i].matches(callback, options)) {
                return i;
            }
        }
        return -1;
    }

    static getIntersectionObserverState(callback, options) {
        for (const intersectionObserverState of IntersectionObserverPool.intersectionObserverStates) {
            if (intersectionObserverState.matches(callback, options)) {
                return intersectionObserverState;
            }
        }
        const intersectionObserverState = new IntersectionObserverState(callback, options);
        IntersectionObserverPool.intersectionObserverStates.push(intersectionObserverState);
        return intersectionObserverState;
    }

    static observe(targetElement, callback, options = {}) {
        options = this.normalizedOptions(options);
        const intersectionObserverState = this.getIntersectionObserverState(callback, options);
        intersectionObserverState.observe(targetElement);
    }

    static unobserve(targetElement, callback, options = {}) {
        options = this.normalizedOptions(options);
        const i = this.getIntersectionObserverStateIndex(callback, options);
        if (i == -1) {
            return;
        }
        const intersectionObserverState = IntersectionObserverPool.intersectionObserverStates[i];
        intersectionObserverState.unobserve(targetElement);
        if (intersectionObserverState.entryCount == 0) {
            IntersectionObserverPool.intersectionObserverStates.splice(i, 1);
        }
    }
}
