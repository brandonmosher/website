import { textToTemplate } from 'Lib/textToTemplate';
import css from './autofit-font.css';
import html from './autofit-font.html';

function waitNTicks(n, callback) {
    function tick(frames) {
        if (frames >= n) {
            callback();
        } else {
            requestAnimationFrame(tick.bind(null, frames + 1));
        }
    }
    tick(0);
}

const template = textToTemplate(css, html);

const ro = new ResizeObserver(entries => {
    for (let entry of entries) {
        const { target } = entry;
        const closest = (target.tagName.includes("AUTOFIT-FONT")) ? target : target.getRootNode().host;
        if (closest.fitDisabled) {
            continue;
        }
        // closest.fitDisabled = true;
        ro.unobserve(closest);
        // requestAnimationFrame(() => {
        //     //closest.fit();
        //     requestAnimationFrame(()=>{
        //         //closest.fit();
        //         requestAnimationFrame(()=>closest.fit());
        //     });
        //     // requestAnimationFrame(() => closest.fitDisabled = false);
        // });
        waitNTicks(10, () => {
            closest.fit();
            // closest.fitDisabled = false;
            ro.observe(closest);
        });
    }
});

window.addEventListener('resize', (e) => {
    requestAnimationFrame(() => {
        document.querySelectorAll('autofit-font-nowrap, autofit-font-wrap').forEach(node => node.fit());
    });
})

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
        waitNTicks(5, () => this.fit());
        waitNTicks(10, () => this.fit());
        // requestAnimationFrame(() => this.fit());
        // if (!(this.hasAttribute('observe-self') || this.hasAttribute('observe-children'))) {
        //     this.setAttribute('observe-self', '');
        // }
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

    fit(init) {
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
            return Math.min(parseInt(style.width) / this.text.scrollWidth, parseInt(style.height) / this.text.scrollHeight);
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
