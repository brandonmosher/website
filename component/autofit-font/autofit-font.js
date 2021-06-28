function fitterHeuristicWrap(target, text) {
    return Math.sqrt(target.clientHeight / text.scrollHeight);
}

function fitterHeuristicNowrap(target, text) {
    const scaleFactorW = target.clientWidth / text.scrollWidth;
    const scaleFactorH = target.clientHeight / text.scrollHeight;
    return Math.min(scaleFactorW, scaleFactorH);
}

function FitterFactory(fitterHeuristic) {
    return function(target) {
        const text = target.shadowRoot.getElementById("text");
        const textStyle = window.getComputedStyle(text);
        const targetStyle = window.getComputedStyle(target);
        const scaleFactor = fitterHeuristic(target, text);
        if ( (scaleFactor < (1 - target.threshold)) || (scaleFactor > (1 + target.threshold)) ) {
            const newFontSize = Math.round(100 * scaleFactor * parseInt(textStyle.fontSize) / parseInt(targetStyle.fontSize));
            text.style.setProperty("--fontSize", `${newFontSize}%`);
        }
    }
}

import { importCSSHTML } from "/lib/importCSSHTML/importCSSHTML.js"

function AutofitFontHTMLElementFactory({tagName, cssPath, htmlPath, fitterHeuristic} = {}) {
    importCSSHTML(cssPath, htmlPath)
    .then(shadowRootContent=>{
        const fitter = FitterFactory(fitterHeuristic);
        const ro = new ResizeObserver(entries => {
            for (let entry of entries) {
                fitter(entry.target);
            }
        });
        customElements.define(tagName,
            class extends HTMLElement {
                constructor() {
                    super();
                    const shadowRoot = this.attachShadow({mode: "open"})
                    shadowRoot.innerHTML = shadowRootContent;
                    ro.observe(this);
                    this.fit();
                }
                
                fit() {
                    fitter(this);
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
        );
    })
}

AutofitFontHTMLElementFactory({
    tagName: "autofit-font-nowrap",
    cssPath: "/component/autofit-font/autofit-font.css",
    htmlPath: "/component/autofit-font/autofit-font.html",
    fitterHeuristic: fitterHeuristicNowrap
});

AutofitFontHTMLElementFactory({
    tagName: "autofit-font-wrap",
    cssPath: "/component/autofit-font/autofit-font.css",
    htmlPath: "/component/autofit-font/autofit-font.html",
    fitterHeuristic: fitterHeuristicWrap
});
