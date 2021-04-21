export function syncWait(ms) {
    const end = Date.now() + ms
    while (Date.now() < end) continue
}

export function asyncWait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// (async () => {
//     console.log('one')
//     await asyncWait(5000)
//     console.log('two')
// })()