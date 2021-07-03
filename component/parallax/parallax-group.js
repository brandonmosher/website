import { OnMutationHTMLElement } from "Component/on-mutation/on-mutation.js"
import css from "./parallax-group.css";
import html from "./parallax-group.html";

function parallaxGroupChildListMutationCallback(mutationRecords, observer) {
    for (const mutationRecord of mutationRecords) {
        if (mutationRecord.type === "childList") {
            mutationRecord.target.updateChildren();
        }
    }
}

customElements.define("parallax-group",
    class extends OnMutationHTMLElement {
        constructor() {
            super();
            const shadowRoot = this.attachShadow({ mode: "open" });
            shadowRoot.innerHTML = `<style>${css}</style>${html}`;
            this.observe(parallaxGroupChildListMutationCallback,
                { childList: true }
            )
            this.updateChildren();
        }

        updateChildren() {
            this.style.perspective = `${this.children.length}px`;
            Array.from(this.children).forEach((child, i, children) => {
                child.style.transform = `translateZ(-${i}px) scale(${1 + (i / children.length)})`;
                child.style.zIndex = children.length - i;
            });
        }
    }
);
