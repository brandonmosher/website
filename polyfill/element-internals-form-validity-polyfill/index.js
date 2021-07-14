function setValidityAttribute(form) {
    if (form.checkValidity()) {
        form.setAttribute("internals-valid", "");
        form.removeAttribute("internals-invalid");
    }
    else {
        form.setAttribute("internals-invalid", "");
        form.removeAttribute("internals-valid");
    }
}

function elementInternalsFormValidityPolyfill() {
    window.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll("form").forEach(form => {
            form.addEventListener("input", (e) => setValidityAttribute(form));
            setValidityAttribute(form);
        });
    });
}

if (!window.ElementInternals || window.ElementInternals.isPolyfilled) {
    elementInternalsFormValidityPolyfill();
}