export async function importCSSHTML(cssPath, htmlPath) {
    if (cssPath) {

    }
    const css = cssPath ? `<style>${await (await fetch(cssPath)).text()}</style>` : "";
    const html = htmlPath ? (await (await fetch(htmlPath)).text()) : "";
    return `${css}${html}`;
}