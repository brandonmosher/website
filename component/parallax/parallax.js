import { OnMutationHTMLElement } from "/component/on-mutation/on-mutation.js"
import { importCSSHTML } from "/lib/importCSSHTML/importCSSHTML.js"

function parallaxGroupChildListMutationCallback(mutationRecords, observer) {
    for(const mutationRecord of mutationRecords) {
        if (mutationRecord.type === "childList") {
            mutationRecord.target.updateChildren();
        }
    }
}

importCSSHTML(
    "/component/parallax/parallax-group.css",
    "/component/parallax/parallax.html")
.then(shadowRootContent => {
    customElements.define("parallax-group",
        class extends OnMutationHTMLElement {
            constructor() {
                super();
                const shadowRoot = this.attachShadow({mode: "open"});
                shadowRoot.innerHTML = shadowRootContent;
                this.observe(parallaxGroupChildListMutationCallback,
                    {childList: true}
                )
                this.updateChildren();
            }

            updateChildren() {
                // let maxHeight = this.scrollHeight;
                this.style.perspective = `${this.children.length}px`;
                Array.from(this.children).forEach((child, i, children) => {
                    child.style.transform = `translateZ(-${i}px) scale(${1 + (i / children.length)})`;
                    child.style.zIndex = children.length - i;
                    // if(window.getComputedStyle(child).position === "absolute" && child.scrollHeight > maxHeight) {
                    //     maxHeight = child.scrollHeight;
                    // }
                });
                // this.style.height = `${maxHeight}px`;
            }
        }
    );
});


importCSSHTML(
    "/component/parallax/parallax-layer.css",
    "/component/parallax/parallax.html")
.then(shadowRootContent => {
    customElements.define("parallax-layer",
        class extends HTMLElement {
            constructor() {
                super();
                const shadowRoot = this.attachShadow({mode: "open"});
                shadowRoot.innerHTML = shadowRootContent;
            }
        }
    );
});