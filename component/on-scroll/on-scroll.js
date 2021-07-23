import { HTMLToCamelCase, camelToHTMLCase } from "Lib/capitalization";
import { textToTemplate } from "Lib/textToTemplate";
import css from './on-scroll.css';
import html from './on-scroll.html';

const template = textToTemplate(css, html);

function callback(entries, observer) {
    entries.forEach(entry => {
        if (entry.intersectionRatio > 0) {
            entry.target.addIntersectionClass();
        }
    });
};

function addScrollFunctions(targetClass) {
    const directions = ['any', 'up', 'down', 'left', 'right'];
    const actions = ['stop', 'start', 'max'];
    directions.forEach(direction => {
        actions.forEach(action => {
            const functionPrefixHTMLCase = `scroll-${direction}-${action}`;
            const functionPrefixCamelCase = HTMLToCamelCase(functionPrefixHTMLCase);
            const [addClassAttrName, removeClassAttrName] = [
                `${functionPrefixHTMLCase}-add-class`,
                `${functionPrefixHTMLCase}-remove-class`
            ];
            // targetClass[functionPrefixCamelCase] = null;
            targetClass[`_${functionPrefixCamelCase}`] = function () {
                const children = this.hasAttribute('query-selector') ?
                    document.querySelectorAll(this.getAttribute('query-selector')) : Array.from(this.children);
                if (this.hasAttribute(addClassAttrName)) {
                    const className = this.getAttribute(addClassAttrName);
                    children.forEach(child => child.classList.add(...className.split(" ")));
                }

                if (this.hasAttribute(removeClassAttrName)) {
                    const className = this.getAttribute(removeClassAttrName);
                    children.forEach(child => child.classList.remove(...className.split(" ")));
                }

                if (this[`scroll${direction}`]) {
                    this[`scroll${direction}`]();
                }
            };
        });
    })
}

class OnScrollHTMLElement extends HTMLElement {
    constructor() {
        super(callback, { 'threshold': 0.25 });
        const shadowRoot = this.attachShadow({ mode: 'open' })
            .appendChild(template.content.cloneNode(true));
    }
}

addScrollFunctions(OnScrollHTMLElement.prototype);

customElements.define('on-scroll', OnScrollHTMLElement);
