"use strict";

export function mixin(obj, ...args) {
    args.forEach((source) => {
        if (source) {
            for (const prop in source) {
                const descriptor = Object.getOwnPropertyDescriptor(source, prop);
                Object.defineProperty(obj, prop, descriptor);
            }
        }
    });
    return obj;
};