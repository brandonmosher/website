export function HTMLToCamelCase(s) {
    return s.replace(/-([a-z])/g, g => g[1].toUpperCase());
}

export function camelToHTMLCase(s) {
    return s.replace(/([a-z][A-Z])/g, g => g[0] + '-' + g[1].toLowerCase());
}

export function underscoreToHTMLCase(s) {
    return s.replace('_', '-');
}
