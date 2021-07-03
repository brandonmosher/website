import css from "./autofit-font.css";
import html from "./autofit-font.html";

const ro = new ResizeObserver(entries => {
    for (let entry of entries) {
        entry.target.fit();
    }
});

class AutofitFontHTMLElement extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: "open" })
        shadowRoot.innerHTML = `<style>${css}</style>${html}`;
        this.fit();
        ro.observe(this);
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
