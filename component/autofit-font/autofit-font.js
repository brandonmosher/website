import { textToTemplate } from 'Lib/textToTemplate';
import css from './autofit-font.css';
import html from './autofit-font.html';

const template = textToTemplate(css, html);

const ro = new ResizeObserver(entries => {
    for (let entry of entries) {
        const { target } = entry;
        const closest = (target.tagName.includes("AUTOFIT-FONT")) ? target : target.getRootNode().host;
        if (closest.fitDisabled) {
            return;
        }
        closest.fitDisabled = true;
        requestAnimationFrame(() => {
            closest.fit();
            requestAnimationFrame(() => closest.fitDisabled = false);
        });
    }
});

class AutofitFontHTMLElement extends HTMLElement {
    static observedAttributes = ['observe-self', 'observe-children'];

    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' })
            .appendChild(template.content.cloneNode(true));
        this.text = this.shadowRoot.getElementById('text');
    }

    connectedCallback() {
        if (!this.isConnected) {
            return;
        }
        if (!(this.hasAttribute('observe-self') || this.hasAttribute('observe-children'))) {
            this.setAttribute('observe-self', '');
        }
    }

    attributeChangedCallback(attrName, oldValue, newValue) {
        switch (attrName) {
            case 'observe-self':
                if (newValue === null) {
                    ro.unobserve(this);
                }
                else {
                    ro.observe(this);
                }
                break;
            case 'observe-children':
                if (newValue === null) {
                    ro.unobserve(this.text);
                }
                else {
                    ro.observe(this.text);
                }
                break;
            default:
                break;
        }
    }

    fitHeuristic(style, textStyle) {
        return 1;
    }

    fit() {
        const [style, textStyle] = [this, this.text].map(getComputedStyle);
        const scaleFactor = this.fitHeuristic(style, textStyle);
        const threshold = this.threshold;
        if ((scaleFactor < (1 - threshold)) || (scaleFactor > (1 + threshold))) {
            this.text.style.fontSize = `${Math.max(1, Math.floor(scaleFactor * parseInt(textStyle.fontSize)))}px`;
        }
    }

    get threshold() {
        if (this.hasAttribute('threshold')) {
            return parseFloat(this.getAttribute('threshold'));
        }
        return 0;
    }

    set threshold(threshold) {
        this.setAttribute('threshold', threshold);
    }
}

customElements.define('autofit-font-nowrap',
    class extends AutofitFontHTMLElement {
        fitHeuristic(style, textStyle) {
            return Math.min(parseInt(style.width) / parseInt(textStyle.width), parseInt(style.height) / parseInt(textStyle.height));
        }
    }
);

customElements.define('autofit-font-wrap',
    class extends AutofitFontHTMLElement {
        fitHeuristic(style, textStyle) {
            return Math.sqrt(parseInt(style.height) / this.text.scrollHeight);
        }
    }
);
