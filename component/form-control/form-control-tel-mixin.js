"use strict;"

function sanitize(value, template, allowed) {
    value = value.filter(c => allowed.includes(c));
    value = value.slice(0, template.length);
    return value;
}

function format(value, template, templatePlaceholder, allowed) {
    const templateSlots = [...template].reduce((acc, cur, idx) => {
        if (cur === templatePlaceholder) {
            acc.push(idx);
        }
        return acc;
    }, []);
    value = sanitize(value, template, allowed);
    if (value.length) {
        value = value.reduce((acc, cur, idx) => {
            acc[templateSlots[idx]] = cur;
            return acc;
        }, [...template]);
    }
    return value;
}

function ssBound(ss, value, template, templatePlaceholder) {
    ss = Math.max(ss, template.indexOf(templatePlaceholder));
    if (value.includes(templatePlaceholder)) {
        ss = Math.min(ss, value.indexOf(templatePlaceholder));
    }
    else {
        ss = Math.min(ss, value.length);
    }
    return ss;
}

function ssMoveNAllowed(ss, value, n, allowed, dir) {
    for (let i = n; i && (ss < value.length); i -= allowed.includes(value[ss]), ss += dir) { }
    return ss;
}

function ssMoveUntilAllowed(ss, value, allowed, dir) {
    while ((ss > 0) && (ss <= value.length) && !allowed.includes(value[ss])) { ss += dir }
    return ss;
}

function ssMoveUntilBordersAllowed(ss, value, allowed, dir) {
    while ((ss > 0) && (ss <= value.length) && !allowed.includes(value[ss]) && !allowed.includes(value[ss - 1])) {
        ss += dir;
    }
    return ss;
}

function simulateBubble(node, type) {    
    node.parentElement.dispatchEvent(new Event(type, {
        bubbles: true,
        cancelable: true,
    }));
}

export const telMixin = {
    _ownAttrs: {
        'template': 'xxx-xxx-xxxx',
        'template-placeholder': 'x',
        'allowed': '0123456789'
    },

    _control: function() {
        const control = document.createElement("input");
        control.addEventListener('keydown', (e) => { this.onkeydown(e); this.oninput(e); simulateBubble(this, 'input');});
        control.addEventListener('paste', (e) => { this.onpaste(e); this.oninput(e); });
        control.addEventListener('change', (e) => { this.onchange(e); this.oninput(e); });
        control.addEventListener('mousedown', (e) => this.onmousedown(e));
        control.addEventListener('mouseup', (e) => this.onmouseup(e));
        return control;
    },

    get template() { return this.getAttribute('template'); },

    get templatePlaceholder() { return this.getAttribute('template-placeholder'); },

    get allowed() { return this.getAttribute('allowed'); },

    onmousedown: function (e) {
        const [template, templatePlaceholder, allowed] = [this.template, this.templatePlaceholder, this.allowed];
        this.style.caretColor = 'transparent';
    },

    onmouseup: function (e) {
        const [template, templatePlaceholder, allowed] = [this.template, this.templatePlaceholder, this.allowed];
        let ss = this.selectionStart;
        let se = this.selectionEnd;
        if (ss !== se) {
            return;
        }
        e.preventDefault();
        let value = [...this.value];
        ss = ssBound(ss, value, template, templatePlaceholder);
        ss = ssMoveUntilBordersAllowed(ss, value, [templatePlaceholder, ...allowed], 1);
        this.setSelectionRange(ss, ss);
        this.style.caretColor = 'unset';
    },

    onchange: function (e) {
        const [template, templatePlaceholder, allowed] = [this.template, this.templatePlaceholder, this.allowed];
        e.preventDefault();
        let value = [...this.value];
        value = format(value, template, templatePlaceholder, allowed);
        this.value = value.join('');
        let ss = ssBound(value.length, value, template, templatePlaceholder);
        this.setSelectionRange(ss, ss);
    },

    onpaste: function (e) {
        const [template, templatePlaceholder, allowed] = [this.template, this.templatePlaceholder, this.allowed];
        e.preventDefault();
        let value = [...this.value];
        let ss = this.selectionStart;
        let clipData = sanitize([...e.clipboardData.getData('Text')], template, allowed);
        value.splice(ss, 0, ...clipData);
        value = format(value, template, templatePlaceholder, allowed);
        this.value = value.join('');
        ss = ssMoveNAllowed(ss, value, clipData.length, allowed, 1);
        ss = ssBound(ss, value, template, templatePlaceholder);
        this.setSelectionRange(ss, ss);
    },

    onkeydown: function (e) {
        const [template, templatePlaceholder, allowed] = [this.template, this.templatePlaceholder, this.allowed];
        let value = [...this.value];
        let ss = this.selectionStart;
        let se = this.selectionEnd;

        if ((e.ctrlKey && !['x', 'c'].includes(e.key)) || (e.shiftKey && ['ArrowLeft', 'ArrowRight'].includes(e.key)) || e.key === 'Tab') {
            return;
        }
        else {
            e.preventDefault();
        }

        if (e.ctrlKey && e.key === 'c') {
            let copyText = value.slice(ss, se + 1);
            copyText = sanitize(copyText, template, allowed);
            navigator.clipboard.writeText(copyText.join(''));
            return;
        }
        else if (e.ctrlKey && e.key === 'x') {
            let cutText = value.splice(ss, se - ss);
            cutText = sanitize(cutText, template, allowed);
            navigator.clipboard.writeText(cutText.join(''));
            value = format(value, template, templatePlaceholder, allowed);
        }
        else if (e.key === 'Backspace') {
            if (ss === se) {
                ss = ssMoveUntilAllowed(ss - 1, value, allowed, -1);
            }
            value.splice(ss, se - ss);
            value = format(value, template, templatePlaceholder, allowed);
            ss = ssMoveUntilBordersAllowed(ss, value, allowed, -1);
        }
        else if (e.key === 'ArrowLeft') {
            ss = ssMoveUntilBordersAllowed(ss === se ? ss - 1 : ss, value, allowed, -1);
        }
        else if (e.key === 'Delete') {
            value.splice(ss, ss === se ? se - ss + 1 : se - ss);
            value = format(value, template, templatePlaceholder, allowed);
        }
        else if (e.key === 'ArrowRight') {
            ss = ssMoveUntilBordersAllowed(ss === se ? ss + 1 : se, value, allowed, 1);
        }
        else if (allowed.includes(e.key)) {
            value.splice(ss, 0, e.key);
            value = format(value, template, templatePlaceholder, allowed);
            ss = ssMoveNAllowed(ss, value, 1, allowed, 1);
            ss = ssMoveUntilAllowed(ss, value, allowed, 1);
        }
        else {
            return;
        }
        this.value = value.join('');
        ss = ssBound(ss, value, template, templatePlaceholder);
        this.setSelectionRange(ss, ss);
    }
}
