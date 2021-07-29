import { mixin } from "Lib/mixin";
import { telMixin } from "./form-control-tel-mixin.js"
import { submitMixin } from "./form-control-submit-mixin.js"
import { textareaMixin } from "./form-control-textarea-mixin.js"
import { observedAttributes } from "./form-control-observed-attributes.js";
import { textToTemplate } from "Lib/textToTemplate";
import html from "./form-control.html";
import css from "./form-control.css";

const template = textToTemplate(css, html);

class FormControlHTMLElement extends HTMLElement {
    _ownAttrs = {};
    _control = document.createElement('input');

    static formAssociated = true;

    static get observedAttributes() { return observedAttributes; }

    constructor() {
        super();
        this._internals = this.attachInternals();
        this.attachShadow({ mode: 'open' })
            .appendChild(template.content.cloneNode(true));

        const type = this.getAttribute('type');
        switch (type) {
            case "tel":
                mixin(this, telMixin);
                break;
            case "textarea":
                mixin(this, textareaMixin);
                break;
            case "submit":
                mixin(this, submitMixin);
                break;
            default:
                break;
        }

        if (typeof this._control === 'function') {
            this._control = this._control();
        }
        this._control.id = 'control';
        this._control.setAttribute('part', 'control');
        this._control.addEventListener('input', () => this.oninput());
        this.shadowRoot.getElementById('container').appendChild(this._control);

        this._controlSizer = this.shadowRoot.querySelector("#control-sizer");

        this.addEventListener('click', (e) => this.focus());
        this.addEventListener('invalid', (e) => { e.preventDefault(); });
        this.addEventListener('focus', (e) => this.focus());
        Object.entries(this._ownAttrs).forEach(([attrName, attrValue]) => {
            if (!this.hasAttribute(attrName)) {
                this.setAttribute(attrName, attrValue);
            }
        });
    }

    setSelectionRange(selectionStart, SelectionEnd, selectionDirection = "none") {
        this._control.setSelectionRange(selectionStart, SelectionEnd, selectionDirection);
    }

    get selectionStart() { return this._control.selectionStart; }

    get selectionEnd() { return this._control.selectionEnd; }

    oninput() {
        this._controlSizer.textContent = this.value.replace(/\s/g, '&nbsp;');
        if(this.hasAttribute('autosize')) {
            this.style.width = `${this._controlSizer.offsetWidth}px`;
        }
        this._internals.setValidity(this._control.validity, this._control.validationMessage);
        this._internals.setFormValue(this._control.value);
        if (this.value) {
            this.removeAttribute("empty");
        }
        else {
            this.setAttribute("empty", "");
        }
        this.shadowRoot.querySelector('#validation-message').innerText = this.validationMessage;
    }

    attributeChangedCallback(attrName, oldValue, newValue) {
        this._control.setAttribute(attrName, newValue);
        this.oninput();
    }

    focus() {
        this._control.focus();
        this.setAttribute('visited', '');
    }

    get value() { return this._control.value; }
    set value(value) { this._control.value = value; }

    get form() { return this._internals.form; }
    get name() { return this.getAttribute('name'); }
    get type() { return this.localName; }
    get validity() { return this._control.validity }
    get validationMessage() { return this._control.validationMessage; }
    get willValidate() { return this._control.willValidate; }

    checkValidity() { return this._control.checkValidity(); }
    reportValidity() { return this._control.reportValidity(); }
}

customElements.define('form-control', FormControlHTMLElement);