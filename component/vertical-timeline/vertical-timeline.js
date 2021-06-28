import { importCSSHTML } from '/lib/importCSSHTML/importCSSHTML.js'

importCSSHTML(
    '/component/vertical-timeline/vertical-timeline.css', null)
.then(shadowRootContent=>{
    customElements.define('vertical-timeline',
        class extends HTMLElement {
            constructor() {
                super();
                const shadowRoot = this.attachShadow({mode: 'open'})
                shadowRoot.innerHTML = `${shadowRootContent}<slot></slot>`;
            }
        }
    );
});

importCSSHTML(
    '/component/vertical-timeline/vertical-timeline-entry.css',
    '/component/vertical-timeline/vertical-timeline-entry.html')
.then(shadowRootContent=>{
    customElements.define('vertical-timeline-entry',
        class extends HTMLElement {
            constructor() {
                super();
                const shadowRoot = this.attachShadow({mode: 'open'})
                shadowRoot.innerHTML = shadowRootContent;
            }
        }
    );
});
