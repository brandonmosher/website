// export function waitNTicks(n, callback) {
//     function tick(frames) {
//         if (frames >= n) {
//             callback();
//         } else {
//             requestAnimationFrame(tick.bind(null, frames + 1));
//         }
//     }
//     tick(0);
// }

export function waitNTicks(n) {
    return new Promise((resolve, reject) => {
        function tick(frames) {
            if (frames >= n) {
                resolve();
            } else {
                requestAnimationFrame(tick.bind(null, frames + 1));
            }
        }
        tick(0);
    });
}