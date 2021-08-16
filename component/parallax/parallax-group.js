import { textToTemplate } from "Lib/textToTemplate";
import css from "./parallax-group.css";
import html from "./parallax-group.html";

const template = textToTemplate(css, html);
customElements.define("parallax-group",
    class extends HTMLElement {
        constructor() {
            super();
            const shadowRoot = this.attachShadow({ mode: 'open' })
                .appendChild(template.content.cloneNode(true));
            if(!this.hasAttribute('scroll-parent')) {
                this.setAttribute('scroll-parent', 'body');
            }
            const perspective = this.children.length;
            let currentElement = this;
            const scrollParentSelector = this.getAttribute('scroll-parent');
            do {
                if(currentElement.matches(scrollParentSelector)) {
                    currentElement.style.perspective = `${perspective}px`;
                }
                currentElement.style.transformStyle = 'preserve-3d';
                currentElement = currentElement.parentElement;
            } while(currentElement !== document.documentElement);
            
            this.querySelectorAll('parallax-layer').forEach((child, i, children) => {
                const translateZ = i;
                const scale = 1 + (translateZ / perspective);
                child.style.transform = `translate3d(calc(-1 * (100vw - 100%) * ${i / (2 * perspective)}),0,-${translateZ}px) scale(${scale})`;
                child.style.zIndex = children.length - i;
            });
        }
    }
);
