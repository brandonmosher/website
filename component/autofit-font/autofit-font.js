import { textToTemplate } from "Lib/textToTemplate";
import css from "./autofit-font.css";
import html from "./autofit-font.html";

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
    static observedAttributes = ['observe-parent', 'observe-children'];

    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' })
            .appendChild(template.content.cloneNode(true));
        this.fit();
    }

    connectedCallback() {
        if (!this.isConnected) {
            return;
        }
        if (!(this.hasAttribute('observe-parent') || this.hasAttribute('observe-children'))) {
            this.setAttribute('observe-parent', "true");
        }
        this.fit();
    }

    attributeChangedCallback(attrName, oldValue, newValue) {
        switch (attrName) {
            case "observe-parent":
                if (newValue === null) {
                    ro.unobserve(this);
                }
                else {
                    ro.observe(this);
                }
                break;
            case "observe-children":
                Array.from(this.children).forEach(child => {
                    if (newValue === null) {
                        ro.unobserve(child);
                    }
                    else {
                        ro.observe(child);
                    }
                });
                break;
            default:
                break;
        }
        this.fit();
    }

    fitHeuristic(target, text) {
        return 1;
    }

    fit() {
        const text = this.shadowRoot.getElementById("text");
        const textStyle = window.getComputedStyle(text);
        const targetStyle = window.getComputedStyle(this);
        const scaleFactor = this.fitHeuristic(this, text);
        if ((scaleFactor < (1 - this.threshold)) || (scaleFactor > (1 + this.threshold))) {
            const newFontSize = Math.round(100 * scaleFactor * parseInt(textStyle.fontSize) / parseInt(targetStyle.fontSize));
            text.style.setProperty("--fontSize", `${newFontSize}%`);
        }
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
