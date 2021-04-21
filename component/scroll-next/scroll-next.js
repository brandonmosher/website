import { IntersectionObserverPool } from '/lib/intersectionObserverPool/intersectionObserverPool.js'
import { importCSSHTML } from '/lib/importCSSHTML/importCSSHTML.js'

const shadowRootContent = await importCSSHTML(
    '/component/scroll-next/scroll-next.css',
    '/component/scroll-next/scroll-next.html');

class ScrollNextHTMLElement extends HTMLElement {
    static intersectionObserverPool = new IntersectionObserverPool();

    static observedAttributeDefaults = {
        'threshold': 0
    }

    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' })
        shadowRoot.innerHTML = shadowRootContent;
    }

    connectedCallback() {
        for (const [name, value] of Object.entries(ScrollNextHTMLElement.observedAttributeDefaults)) {
            this.setAttribute(name, this.hasAttribute(name) ? this.getAttribute(name) : value);
        }
    }

    static get observedAttributes() { return Object.keys(ScrollNextHTMLElement.observedAttributeDefaults); }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'threshold':
                ScrollNextHTMLElement.intersectionObserverPool.reobserve(
                    this,
                    ScrollNextHTMLElement.callback,
                    { 'threshold': 0},
                    ScrollNextHTMLElement.callback,
                    { 'threshold': 0}
                    //[0, 0.1, 0.2, 0.3, 0.4, .05, 0.6, 0.7, 0.8, 0.9, 1]
                );
                break;
            default:
            // code block
        }
    }

    static callback(entries, observer) {
        entries.forEach(entry => {
            const { target } = entry;
            console.log(target, entry.isIntersecting, entry.boundingClientRect.top, entry.boundingClientRect.bottom, window.innerHeight, entry.intersectionRatio);
            console.log(target.getAttribute('dir'));
            if (entry.boundingClientRect.top < 0) {
                if (entry.isIntersecting) {
                    console.log('entered viewport at the top edge, hence scroll direction is up');
                    //target.parentElement.style.overflowY = 'scroll';
                } else {
                    console.log('left viewport at the top edge, hence scroll direction is down');
                    //target.parentElement.style.overflowY = 'scroll';
                }
            }
            else if(entry.boundingClientRect.bottom >= window.innerHeight) {
                if (entry.isIntersecting) {
                    console.log('entered viewport at the bottom edge, hence scroll direction is down');
                    //target.parentElement.scrollTop = target.parentElement.scrollHeight;
                    //target.parentElement.style.overflowY = 'hidden';
                    target.parentElement.nextSibling.scrollIntoView({ 
                        behavior: 'smooth' 
                    });
                } else {
                    console.log('left viewport at the bottom edge, hence scroll direction is up');
                    //target.parentElement.style.overflowY = 'scroll';
                }
            }
            else {
                //target.parentElement.style.overflowY = 'scroll';
            }
        });
    }
}

customElements.define('scroll-next', ScrollNextHTMLElement);
