import { textToTemplate } from "Lib/textToTemplate";
import css from "./autofit-font.css";
import html from "./autofit-font.html";

const bound = (value, lower, upper) => {
    return Math.min(Math.max(lower, value), upper);
}

const template = textToTemplate(css, html);

const ro = new ResizeObserver(entries => {
    for (let entry of entries) {
        const closest = entry.target.closest('autofit-font-nowrap, autofit-font-wrap');
        if (closest) {
            closest.fit();
        }
    }
});

class AutofitFontHTMLElement extends HTMLElement {
    fitPending = false;
    static observedAttributes = ['observe-self', 'observe-children'];

    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' })
            .appendChild(template.content.cloneNode(true));
        this.text = this.shadowRoot.getElementById("text");
        this.fontSize = parseInt(window.getComputedStyle(this.text).fontSize);
        this.fit();
    }

    connectedCallback() {
        if (!this.isConnected) {
            return;
        }
        if (!(this.hasAttribute('observe-self') || this.hasAttribute('observe-children'))) {
            this.setAttribute('observe-self', "true");
        }
        this.fit();
    }

    attributeChangedCallback(attrName, oldValue, newValue) {
        switch (attrName) {
            case "observe-self":
                if (newValue === null) {
                    ro.unobserve(this);
                }
                else {
                    ro.observe(this);
                }
                break;
            case "observe-children":
                if (newValue === null) {
                    Array.from(this.children).forEach(child => ro.unobserve(child));
                }
                else {
                    Array.from(this.children).forEach(child => ro.observe(child));
                }
                break;
            default:
                break;
        }
        this.fit();
    }

    fitHeuristic(target, text) {
        return 1;
    }
    get fontSize() {
        return parseInt(this.text.style.getPropertyValue("--fontSize"));
    }

    set fontSize(fontSize) {
        this.text.style.setProperty("--fontSize", `${parseInt(fontSize)}px`);
    }

    fit() {
        this.fitPending = true;
        const fontSize = this.fontSize;
        const scaleFactor = bound(
            this.fitHeuristic(this, this.text),
            1 / fontSize,
            this.clientHeight / fontSize
        );
        const threshold = this.threshold;
        if ((scaleFactor < (1 - threshold)) || (scaleFactor > (1 + threshold))) {
            const newFontSize = Math.floor(scaleFactor * fontSize);
            this.fontSize = newFontSize;
        }
        requestAnimationFrame(() => this.fitPending = false);
        // console.log(scaleFactor);
    }

    get threshold() {
        if (this.hasAttribute("threshold")) {
            return parseFloat(this.getAttribute("threshold"));
        }
        return 0;
    }

    set threshold(threshold) {
        this.setAttribute("threshold", threshold);
    }
}

customElements.define("autofit-font-nowrap",
    class extends AutofitFontHTMLElement {
        fitHeuristic(target, text) {
            const scaleFactorW = target.clientWidth / text.scrollWidth;
            const scaleFactorH = target.clientHeight / text.scrollHeight;
            return Math.min(scaleFactorW, scaleFactorH);
        }
    }
);

customElements.define("autofit-font-wrap",
    class extends AutofitFontHTMLElement {
        fitHeuristic(target, text) {
            return Math.sqrt(target.clientHeight / text.scrollHeight);
        }
    }
);
