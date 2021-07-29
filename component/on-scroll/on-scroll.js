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
                if (this.hasAttribute(addClassAttrName)) {
                    const className = this.getAttribute(addClassAttrName);
                    this.applyNodes.forEach(child => child.classList.add(...className.split(" ")));
                }

                if (this.hasAttribute(removeClassAttrName)) {
                    const className = this.getAttribute(removeClassAttrName);
                    this.applyNodes.forEach(child => child.classList.remove(...className.split(" ")));
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
        super();
        this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true));
        this.applyNodes = this.closest('on-scroll-container').querySelectorAll(this.getAttribute('query-selector-apply'));
    }
}

addScrollFunctions(OnScrollHTMLElement.prototype);

customElements.define('on-scroll', OnScrollHTMLElement);
