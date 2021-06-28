import { importCSSHTML } from '/lib/importCSSHTML/importCSSHTML.js'

importCSSHTML(
    '/component/arrow-box/arrow-box-left.css',
    '/component/arrow-box/arrow-box.html')
.then(shadowRootContent=>{
    customElements.define('arrow-box-left',
        class extends HTMLElement {
            constructor() {
                super();
                const shadowRoot = this.attachShadow({mode: 'open'})
                shadowRoot.innerHTML = shadowRootContent;
            }
        }
    );
})

importCSSHTML(
    '/component/arrow-box/arrow-box-right.css',
    '/component/arrow-box/arrow-box.html')
.then(shadowRootContent=>{
    customElements.define('arrow-box-right',
        class extends HTMLElement {
            constructor() {
                super();
                const shadowRoot = this.attachShadow({mode: 'open'})
                shadowRoot.innerHTML = shadowRootContent;
            }
        }
    );
})