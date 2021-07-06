"use strict;"

export function sanitize(value, template, allowed) {
    value = value.filter(c => allowed.includes(c));
    value = value.slice(0, template.length);
    return value;
}

export function format(value, template, placeHolder, allowed) {
    const templateSlots = [...template].reduce((acc, cur, idx) => {
        if (cur === placeHolder) {
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

function ssBound(ss, value, template, placeHolder) {
    ss = Math.max(ss, template.indexOf(placeHolder));
    if (value.includes(placeHolder)) {
        ss = Math.min(ss, value.indexOf(placeHolder));
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

export function mousedownCallbackGenerator({ template, placeHolder, allowed } = {}) {
    return (e) => {
        e.target.style.caretColor = 'transparent';
    }
}

export function mouseupCallbackGenerator({ template, placeHolder, allowed } = {}) {
    return (e) => {
        let ss = e.target.selectionStart;
        let se = e.target.selectionEnd;
        if (ss !== se) {
            return;
        }
        e.preventDefault();
        let value = [...e.target.value];
        ss = ssBound(ss, value, template, placeHolder);
        ss = ssMoveUntilBordersAllowed(ss, value, [placeHolder, ...allowed], 1);
        e.target.setSelectionRange(ss, ss);
        e.target.style.caretColor = 'unset';
    }
};

export function changeCallbackGenerator({ template, placeHolder, allowed } = {}) {
    return (e) => {
        e.preventDefault();
        let value = [...e.target.value];
        value = format(value, template, placeHolder, allowed);
        e.target.value = value.join('');
        let ss = ssBound(value, value.length, template, placeHolder);
        e.target.setSelectionRange(ss, ss);
    }
};

export function pasteCallbackGenerator({ template, placeHolder, allowed } = {}) {
    return (e) => {
        e.preventDefault();
        let value = [...e.target.value];
        let ss = e.target.selectionStart;
        let clipData = sanitize([...e.clipboardData.getData('Text')], template, allowed);
        value.splice(ss, 0, ...clipData);
        value = format(value, template, placeHolder, allowed);
        e.target.value = value.join('');
        ss = ssMoveNAllowed(ss, value, clipData.length, allowed, 1);
        ss = ssBound(ss, value, template, placeHolder);
        e.target.setSelectionRange(ss, ss);
    }
};

export function keyDownCallbackGenerator({ template, placeHolder, allowed } = {}) {
    return (e) => {

        let value = [...e.target.value];
        let ss = e.target.selectionStart;
        let se = e.target.selectionEnd;

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
            value = format(value, template, placeHolder, allowed);
        }
        else if (e.key === 'Backspace') {
            if (ss === se) {
                ss = ssMoveUntilAllowed(ss - 1, value, allowed, -1);
            }
            value.splice(ss, se - ss);
            value = format(value, template, placeHolder, allowed);
            ss = ssMoveUntilBordersAllowed(ss, value, allowed, -1);
        }
        else if (e.key === 'ArrowLeft') {
            ss = ssMoveUntilBordersAllowed(ss === se ? ss - 1 : ss, value, allowed, -1);
        }
        else if (e.key === 'Delete') {
            value.splice(ss, ss === se ? se - ss + 1: se - ss);
            value = format(value, template, placeHolder, allowed);
        }
        else if (e.key === 'ArrowRight') {
            ss = ssMoveUntilBordersAllowed(ss === se ? ss + 1 : se, value, allowed, 1);
        }
        else if (allowed.includes(e.key)) {
            value.splice(ss, 0, e.key);
            value = format(value, template, placeHolder, allowed);
            ss = ssMoveNAllowed(ss, value, 1, allowed, 1);
            ss = ssMoveUntilAllowed(ss, value, allowed, 1);
        }
        else {
            return;
        }
        e.target.value = value.join('');
        ss = ssBound(ss, value, template, placeHolder);
        e.target.setSelectionRange(ss, ss);
    }
}