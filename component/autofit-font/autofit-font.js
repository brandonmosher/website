import { waitNTicks } from 'Lib/wait';
import { textToTemplate } from 'Lib/textToTemplate';
import css from './autofit-font.css';
import html from './autofit-font.html';
const template = textToTemplate(css, html);

class AutofitFontHTMLElement extends HTMLElement {
    connectedCallback() {
        if (!this.isConnected) {
            return;
        }
        this.scheduleFit();
    }

    fitHeuristic() {
        return 1;
    }

    fit() {
        const scaleFactor = this.fitHeuristic();
        const threshold = this.threshold;
        if ((scaleFactor < (1 - threshold)) || (scaleFactor > (1 + threshold))) {
            this.applyNodes.forEach(node => {
                const nodeStyle = getComputedStyle(node);
                node.style.fontSize = `${Math.max(1, Math.floor(this.baseScaleFactor * scaleFactor * parseInt(nodeStyle.fontSize)))}px`;
            });
        }
    }

    scheduleFit(ticks = 5) {
        if (this.fitDisabled) {
            return;
        }
        this.fitDisabled = true;
        waitNTicks(ticks).then(() => {
            this.fit();
            this.fitDisabled = false;
        });
    }

    get baseScaleFactor() {
        if (this.hasAttribute('base-scale-factor')) {
            return parseFloat(this.getAttribute('base-scale-factor'));
        }
        return 1;
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

const ro = new ResizeObserver(entries => {
    for (let entry of entries) {
        const { target } = entry;
        const closest = (target.tagName.includes("AUTOFIT-FONT")) ? target : target.getRootNode().host;
        closest.scheduleFit();
    }
});

class AutofitFontSelfHTMLElement extends AutofitFontHTMLElement {
    static observedAttributes = ['observe-self', 'observe-children'];

    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' })
            .appendChild(template.content.cloneNode(true));
        this.text = this.shadowRoot.getElementById('text');
        this.applyNodes = [this.text];
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
}

customElements.define('autofit-font-nowrap',
    class extends AutofitFontSelfHTMLElement {
        fitHeuristic() {
            const style = getComputedStyle(this);
            return Math.min(parseInt(style.width) / this.text.scrollWidth, parseInt(style.height) / this.text.scrollHeight);
        }
    }
);

customElements.define('autofit-font-wrap',
    class extends AutofitFontSelfHTMLElement {
        fitHeuristic() {
            const style = getComputedStyle(this);
            return Math.sqrt(parseInt(style.height) / this.text.scrollHeight);
        }
    }
);

customElements.define('autofit-font-query-selector',
    class extends AutofitFontHTMLElement {
        connectedCallback() {
            super.connectedCallback();
            this.assessNodes = this.parentElement.querySelectorAll(this.getAttribute('query-selector-assess'));
            this.applyNodes = this.parentElement.querySelectorAll(this.getAttribute('query-selector-apply'));
            this.observeNodes = this.parentElement.querySelectorAll(this.getAttribute('query-selector-observe'));
            if (this.observeNodes.length) {
                this.ro = new ResizeObserver(() => this.scheduleFit());
                this.observeNodes.forEach(node => this.ro.observe(node));
            }
            if (this.hasAttribute('query-selector-event') && this.hasAttribute('event-types')) {
                this.eventNodes = this.parentElement.querySelectorAll(this.getAttribute('query-selector-event'));
                this.eventTypes = this.getAttribute('event-types').split(' ');
                this.eventNodes.forEach(eventNode => {
                    this.eventTypes.forEach(eventType => {
                        eventNode.addEventListener(eventType, () => this.scheduleFit());
                    })
                })
            }
        }

        fitHeuristic() {
            this.applyNodes.forEach(node => node.style.removeProperty('font-Size'));
            let minScaleFactor = Infinity;
            if(this.hasAttribute('wrap')){
                this.assessNodes.forEach(node => {
                    minScaleFactor = Math.min(minScaleFactor, Math.sqrt(node.clientHeight / node.scrollHeight));
                });
            }
            else {
                this.assessNodes.forEach(node => {
                    minScaleFactor = Math.min(minScaleFactor, node.clientWidth / node.scrollWidth, node.clientHeight / node.scrollHeight);
                });
            }
            
            return minScaleFactor;
        }
    }
);

window.addEventListener('resize', (e) => {
    requestAnimationFrame(() => {
        document.querySelectorAll('autofit-font-nowrap, autofit-font-wrap, autofit-font-query-selector').forEach(node => node.scheduleFit());
    });
});

// const nodeStyle = getComputedStyle(node);
// const a = Math.min(
//     minScaleFactor,
//     parseInt(nodeStyle.width) / node.scrollWidth,
//     parseInt(nodeStyle.height) / node.scrollHeight
// );

// const b = minScaleFactor = Math.min(
//     minScaleFactor,
//     parseInt(nodeStyle.width) / (node.scrollWidth - parseInt(nodeStyle.paddingLeft) - parseInt(nodeStyle.paddingRight)),
//     parseInt(nodeStyle.height) / (node.scrollHeight - parseInt(nodeStyle.paddingTop) - parseInt(nodeStyle.paddingBottom))
// );
// console.log(minScaleFactor, a, b);