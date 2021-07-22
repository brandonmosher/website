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
            this.scrollParent.style.transformStyle = 'preserve-3d';
            this.scrollParent.style.perspective = `${this.children.length}px`;
            this.querySelectorAll('parallax-layer').forEach((child, i, children) => {
                child.style.transform = `translateZ(-${i}px) scale(${1 + (i / children.length)})`;
                child.style.zIndex = children.length - i;
            });
        }
        get scrollParent() {
            return document.querySelector(this.getAttribute('scroll-parent'));
        }
    }
);
