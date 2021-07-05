import css from "./contact-form.css";
import html from "./contact-form.html";

function formatPhone(value, format, placeHolder, allowed) {
    const formatSlots = [...format].reduce((acc, cur, idx) => { 
        if(cur === placeHolder) {
            acc.push(idx);
        }
        return acc;
    }, []);
    value = value.slice(0, format.length);
    value = value.filter(c => allowed.includes(c));
    value = value.reduce((acc, cur, idx) => {
        acc[formatSlots[idx]] = cur;
        return acc;
    }, [...format]);
    return value;
}

function onKeyDown(e) {
    const placeHolder = '_';
    const format = '(___) ___-____';
    const allowed = '0123456789';
    const numericKeyCodes = [48, 96, 49, 97, 50, 98, 51, 99, 52, 100, 53, 101, 54, 102, 55, 103, 56, 104, 57, 105];
    
    e.preventDefault(); // if([...numericKeyCodes, 8, 37, 39, 46].includes(e.keyCode))

    const s = e.target.selectionStart;
    let value = [...e.target.value];
    let i = s;
    if (e.keyCode === 8) { // backspace
        while(--i > 1 && !allowed.includes(value[i])) {}
        value.splice(i, 1);
        while(i > 1 && !allowed.includes(value[i - 1])) { --i; }
    }
    else if(e.keyCode === 37) { // left arrow
        while(--i > 1 && !allowed.includes(value[i]) && !allowed.includes(value[i - 1])) {}
    }
    else if(e.keyCode === 46) { // delete
        value.splice(s, 1);
    }
    else if(e.keyCode === 39) { // right arrowy
        while(value[i] != placeHolder && ++i < value.length && !allowed.includes(value[i])) {}
    }
    else if(numericKeyCodes.includes(e.keyCode)) {
        value.splice(s, 0, String.fromCharCode(e.keyCode));
        value = formatPhone(value, format, placeHolder, allowed);
        while(value[i] != placeHolder && ++i < value.length && !allowed.includes(value[i])) {}
    }
    else {
        return;
    }

    value = formatPhone(value, format, placeHolder, allowed);
    e.target.value = value.join("");
    // if(delta != 0) {
    //     do {
    //         i += delta
    //     } while (i > 0 && i < value.length && ![placeHolder, ...allowed].includes(value[i]));
    // }
    i = Math.min(Math.max(i, 1), value.length);
    e.target.setSelectionRange(i, i);
}

customElements.define('contact-form',
    class extends HTMLElement {
        constructor() {
            super();
            const shadowRoot = this.attachShadow({ mode: 'open' })
            shadowRoot.innerHTML = `<style>${css}</style>${html}`;
            const phoneInput = this.shadowRoot.querySelector("#phone");
            phoneInput.addEventListener("keydown", onKeyDown);
        }
    }
);