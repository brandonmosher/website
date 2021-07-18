import { textToTemplate } from "Lib/textToTemplate";
import css from './on-scroll.css';
import html from './on-scroll.html';

const template = textToTemplate(css, html);

function callback(entries, observer) {
    entries.forEach(entry => {
        if(entry.intersectionRatio > 0) {
            entry.target.addIntersectionClass();
        }
    });
};

function addScrollFunctions(targetClass) {
    const directions = ['up', 'down', 'left', 'right', 'stop', 'start'];
    directions.forEach(direction => {
        targetClass[`scroll${direction}`] = null;

        const actionClassAttrName = (direction, action) => `scroll-${direction}-${action}-class`;
        const [addClassAttrName, removeClassAttrName] = [actionClassAttrName(direction, 'add'), actionClassAttrName(direction, 'remove')];
        targetClass[`_scroll${direction}`] = function () {
            const children = Array.from(this.children);
            if (this.hasAttribute(addClassAttrName)) {
                const className = this.getAttribute(addClassAttrName);
                children.forEach(child => child.classList.add(className));
            }

            if (this.hasAttribute(removeClassAttrName)) {
                const className = this.getAttribute(removeClassAttrName);
                children.forEach(child => child.classList.remove(className));
            }

            if (this[`scroll${direction}`]) {
                this[`scroll${direction}`]();
            }
        };
    });
}

class OnScrollHTMLElement extends HTMLElement {
    constructor() {
        super(callback, {'threshold': 0.25});
        const shadowRoot = this.attachShadow({ mode: 'open' })
    .appendChild(template.content.cloneNode(true));
    }
}

addScrollFunctions(OnScrollHTMLElement.prototype);

customElements.define('on-scroll', OnScrollHTMLElement);
