import { OnMutationHTMLElement } from "Component/on-mutation/on-mutation.js"
import { textToTemplate } from "Lib/textToTemplate";
import css from "./parallax-group.css";
import html from "./parallax-group.html";

const template = textToTemplate(css, html);

function getScrollParent(element, includeHidden = false) {
    let style = getComputedStyle(element);
    let excludeStaticParent = style.position === "absolute";
    let overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/;

    if (style.position === "fixed") {
        return document.body;
    }
    for (let parent = element; (parent = parent.parentElement);) {
        style = getComputedStyle(parent);
        if (excludeStaticParent && style.position === "static") {
            continue;
        }
        if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX)) {
            return parent;
        }
    }
    return document.body;
}

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
            const shadowRoot = this.attachShadow({ mode: 'open' })
                .appendChild(template.content.cloneNode(true));
            this.observe(parallaxGroupChildListMutationCallback,
                { childList: true }
            )

        }
        connectedCallback() {
            this.updateChildren();
        }
        updateChildren() {
            const scrollParent = getScrollParent(this);
            scrollParent.style.transformStyle = 'preserve-3d';
            scrollParent.style.perspective = `${this.children.length}px`;
            this.querySelectorAll('parallax-layer').forEach((child, i, children) => {
                child.style.transform = `translateZ(-${i}px) scale(${1 + (i / children.length)})`;
                child.style.zIndex = children.length - i;
            });
        }
    }
);
