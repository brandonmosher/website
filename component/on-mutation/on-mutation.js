import { MutationObserverPool } from "Lib/mutationObserverPool/mutationObserverPool.js"

export class OnMutationHTMLElement extends HTMLElement {
    mutationCallback = null;

    observe(mutationCallback, options) {
        MutationObserverPool.observe(mutationCallback, this, options);
        this.mutationCallback = mutationCallback;
    }

    unobserve() {
        MutationObserverPool.unobserve(this.mutationCallback, this);
        this.mutationCallback = null;
    }
}

customElements.define("on-mutation", OnMutationHTMLElement);
