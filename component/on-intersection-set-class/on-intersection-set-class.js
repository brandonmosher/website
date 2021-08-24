import { OnIntersectionHTMLElement } from 'Component/on-intersection/on-intersection.js';
import { HTMLToCamelCase } from "Lib/capitalization";
import { textToTemplate } from "Lib/textToTemplate";
import css from './on-intersection-set-class.css';
import html from './on-intersection-set-class.html';

const template = textToTemplate(css, html);

function handleIntersect(entries) {
    entries.forEach(async entry => {
        const { target, intersectionRatio, isIntersecting } = entry;
        const { x, y } = entry.boundingClientRect;
        const { previousX = x + 1, previousY = y + 1, previousIntersectionRatio = 0 } = target;
        let [direction, boundary] = [null, null];
        if (!intersectionRatio && !isIntersecting) {
            return;
        }
        if ((y < previousY)) { //scroll down / element moving up
            if (intersectionRatio > previousIntersectionRatio && isIntersecting) {
                boundary = 'bottom';
                direction = 'enter';
            }
            else {
                boundary = 'top';
                direction = 'exit';
            }
        }
        else if ((y > previousY)) { //scroll up / element moving down
            if (intersectionRatio > previousIntersectionRatio && isIntersecting) {
                boundary = 'top';
                direction = 'enter';
            }
            else {
                boundary = 'bottom';
                direction = 'exit';
            }
        }
        else if ((x < previousX) && isIntersecting) { }
        else if ((x > previousX) && isIntersecting) { }
        // console.log(entry.target, direction, boundary, isIntersecting, intersectionRatio, y, previousY);
        if (direction) {
            target[HTMLToCamelCase(`_${direction}-any`)]();
            if (boundary) {
                target[HTMLToCamelCase(`_${direction}-${boundary}`)]();
            }
        }
        Object.assign(target, { previousX: x, previousY: y, previousIntersectionRatio: intersectionRatio });
    })
}

function addIntersectionFunctions(targetClass) {
    const directions = ['enter', 'exit'];
    const boundaries = ['any', 'top', 'left', 'bottom', 'right'];

    directions.forEach(direction => {
        boundaries.forEach(boundary => {
            const functionPrefixHTMLCase = `${direction}-${boundary}`;
            const functionPrefixCamelCase = HTMLToCamelCase(functionPrefixHTMLCase);
            const [addClassAttrName, removeClassAttrName] = [
                `${functionPrefixHTMLCase}-add-class`,
                `${functionPrefixHTMLCase}-remove-class`
            ];
            targetClass[functionPrefixCamelCase] = null;
            targetClass[`_${functionPrefixCamelCase}`] = function () {
                const children = this.hasAttribute('query-selector') ?
                    document.querySelectorAll(this.getAttribute('query-selector')) : Array.from(this.children);
                if (this.hasAttribute(removeClassAttrName)) {
                    const className = this.getAttribute(removeClassAttrName);
                    children.forEach(child => child.classList.remove(...className.split(" ")));
                }

                if (this.hasAttribute(addClassAttrName)) {
                    const className = this.getAttribute(addClassAttrName);
                    children.forEach(child => child.classList.add(...className.split(" ")));
                }

                if (this[functionPrefixCamelCase]) {
                    this[functionPrefixCamelCase]();
                }
                this.dispatchEvent(new Event(functionPrefixCamelCase.toLowerCase()));
            };
        });
    })
}

class OnIntersectionAddClassHTMLElement extends OnIntersectionHTMLElement {
    constructor() {
        super(handleIntersect, { 'threshold': 0.25 });
        const shadowRoot = this.attachShadow({ mode: 'open' })
            .appendChild(template.content.cloneNode(true));
    }
}

addIntersectionFunctions(OnIntersectionAddClassHTMLElement.prototype);

customElements.define('on-intersection-set-class', OnIntersectionAddClassHTMLElement);
