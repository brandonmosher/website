import { OnIntersectionHTMLElement } from "/component/on-intersection/on-intersection.js"

export function IntersectionTransitionFactory({tagName, intersectionRatio, transition, transitionPropertyValues} = {}) {
    customElements.define(tagName,
        class IntersectionTransitionHTMLElement extends OnIntersectionHTMLElement {    
            static observedAttributeDefaults = {
                "intersection-ratio": intersectionRatio,
                "transition": transition,
                "transition-property-values": transitionPropertyValues,
            }

            constructor() {
                super();
                const shadowRoot = this.attachShadow({ mode: "open" })
                shadowRoot.innerHTML = "<slot></slot>";    
            }

            connectedCallback() {
                for (const [name, value] of Object.entries(IntersectionTransitionHTMLElement.observedAttributeDefaults)) {
                    this.setAttribute(name, this.hasAttribute(name) ? this.getAttribute(name) : value);
                }
            }

            static get observedAttributes() { return Object.keys(IntersectionTransitionHTMLElement.observedAttributeDefaults); }

            get transitionChildren() {
                return Array.from(this.children);
            }

            get transitionPropertyNames() {
                return this.getAttribute("transition")
                .split(",")
                .map(transition=>transition.split(" ")[0]);
            }

            get transitionPropertyValues() {
                return this.getAttribute("transition-property-values")
                .split(",")
                .map(valuePair=>valuePair.trim())
                .map(valuePair=>valuePair.split(" "));
            }

            set transitionPropertyValues(transitionPropertyValues) {
                this.transitionChildren.forEach(transitionChild=>{
                    this.transitionPropertyNames.forEach((propertyName, i)=>{ 
                        transitionChild.style.setProperty(propertyName, transitionPropertyValues[i]);
                    });
                });
            }

            get transitionPropertyValuesInitial() {
                return this.transitionPropertyValues.map(transitionPropertyValue=>transitionPropertyValue[0]);
            }

            get transitionPropertyValuesFinal() {
                return this.transitionPropertyValues.map(transitionPropertyValue=>transitionPropertyValue[1]);
            }

            get transition() {
                this.transitionChildren.map(transitionChild=>transitionChild.style.transition);
            }

            set transition(transition) {
                this.transitionChildren.forEach(transitionChild=>{
                    transitionChild.style.transition = transition;});
            }

            attributeChangedCallback(name, oldValue, newValue) {
                switch (name) {
                    case "intersection-ratio":
                        this.observe(IntersectionTransitionHTMLElement.callback, { "threshold": newValue });
                        break;
                    case "transition":
                        this.transition = newValue;
                        break;
                    case "transition-property-values":
                        this.transitionPropertyValues = this.transitionPropertyValuesInitial;
                        break;
                    default:
                }
            }

            static callback(entries, observer) {
                entries.forEach(entry => {
                    const { target } = entry;
                    if (entry.intersectionRatio >= target.getAttribute("intersection-ratio")) {
                        target.transitionPropertyValues = target.transitionPropertyValuesFinal;
                    } else {
                        //do nothing?
                    }
                });
            };
        }
    );
}
