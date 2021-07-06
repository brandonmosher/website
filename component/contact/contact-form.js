import css from './contact-form.css';
import html from './contact-form.html';
import * as phoneFormatter from "Lib/phoneFormatter/phoneFormatter.js"

customElements.define('contact-form',
    class extends HTMLElement {
        constructor() {
            super();
            const shadowRoot = this.attachShadow({ mode: 'open' })
            shadowRoot.innerHTML = `<style>${css}</style>${html}`;
            PhoneInput: {
                const phoneFormatterOptions = {
                    template: '(___) ___-____',
                    placeHolder: "_",
                    allowed: "0123456789"
                }
                const phoneInput = this.shadowRoot.querySelector('#phone');
                phoneInput.pattern = "\([0-9]{3}\) [0-9]{3}-[0-9]{4}";
                phoneInput.addEventListener('keydown', phoneFormatter.keyDownCallbackGenerator(phoneFormatterOptions));
                phoneInput.addEventListener('paste', phoneFormatter.pasteCallbackGenerator(phoneFormatterOptions));
                phoneInput.addEventListener('change', phoneFormatter.changeCallbackGenerator(phoneFormatterOptions));
                phoneInput.addEventListener('mousedown', phoneFormatter.mousedownCallbackGenerator(phoneFormatterOptions));
                phoneInput.addEventListener('mouseup', phoneFormatter.mouseupCallbackGenerator(phoneFormatterOptions));
            }
        }
    }
);