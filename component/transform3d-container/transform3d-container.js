import { importCSSHTML } from '/lib/importCSSHTML/importCSSHTML.js'

importCSSHTML(
    '/component/transform3d-container/transform3d-container.css',
    '/component/transform3d-container/transform3d-container.html')
.then(shadowRootContent=>{
    customElements.define('transform3d-container',
        class extends HTMLElement {
            constructor() {
                super();
                const shadowRoot = this.attachShadow({mode: 'open'})
                shadowRoot.innerHTML = shadowRootContent;
            }
        }
    );
})