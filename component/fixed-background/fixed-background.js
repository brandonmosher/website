import { importCSSHTML } from '/lib/importCSSHTML/importCSSHTML.js'

importCSSHTML(
    '/component/fixed-background/fixed-background.css',
    '/component/fixed-background/fixed-background.html')
.then(shadowRootContent=>{
    customElements.define('fixed-background',
        class extends HTMLElement {
            constructor() {
                super();
                const shadowRoot = this.attachShadow({mode: 'open'})
                shadowRoot.innerHTML = shadowRootContent;
            }
        }
    );
})