export function textToTemplate(css, html) {
    const template = document.createElement("template");
    template.innerHTML = `<style>${css}</style>${html}`;
    return template;
}