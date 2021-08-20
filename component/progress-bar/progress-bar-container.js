import { textToTemplate } from "Lib/textToTemplate";
import css from "./progress-bar-container.css";
import html from "./progress-bar-container.html";

const template = textToTemplate(css, html);

customElements.define("progress-bar-container",
    class extends HTMLElement {
        constructor() {
            super();
            const shadowRoot = this.attachShadow({ mode: 'open' })
                .appendChild(template.content.cloneNode(true));
        }

        centerProgressBars() {
            const pbs = Array.from(this.children);

            pbs.forEach(pb => pb.shadowRoot.querySelector('#label-left').style.removeProperty('width'));

            const maxPbLabelWidth = pbs.reduce((maxPbLabelWidth, pb) =>
                Math.max(maxPbLabelWidth, pb.shadowRoot.querySelector('#label-left').clientWidth), 0);
            
            const calcPbEmptyWidth = (pb) => {
                const pbCr = pb.getBoundingClientRect();
                const labelRightCr = pb.shadowRoot.querySelector('#label-right').getBoundingClientRect();
                return pbCr.width - (labelRightCr.left + labelRightCr.width - pbCr.left);
            }
            
            const minPbEmptyWidth = pbs.reduce((minPbEmptyWidth, pb) => 
                Math.min(minPbEmptyWidth, calcPbEmptyWidth(pb)), Infinity);

            pbs.forEach(pb =>
                pb.shadowRoot.querySelector('#label-left').style.width = `${maxPbLabelWidth + (minPbEmptyWidth / 2)}px`);
        }
    }
);