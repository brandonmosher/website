import { HTMLToCamelCase } from "Lib/capitalization";
import { textToTemplate } from "Lib/textToTemplate";

let globalYDirection = null;
let scrollStopThresholdY = 0;

const thresholdArray = steps => Array(steps + 1)
    .fill(0)
    .map((_, index) => index / steps || 0);

function init(scrollContainer) {
    const observer = new IntersectionObserver((entries) => handleIntersect(scrollContainer, entries), {
        threshold: thresholdArray(10)
    });
    requestAnimationFrame(() => {
        scrollContainer.attachShadow({ mode: 'open' });
        scrollContainer.shadowRoot.innerHTML = '<slot></slot>';
        const scrollHeight = 100 * scrollContainer.scrollHeight / window.innerHeight;
        const els = [];
        const el = document.createElement("div");
        Object.assign(el.style, {
            position: 'absolute',
            height: '1%',
            top: `${scrollHeight - 1}%`,
            left: '0',
            right: '0',
            visibility: 'hidden'
        });
        for (let i = 0, h = scrollHeight; h > 0; ++i, h -= 200) {
            els.push(el.cloneNode(true));
            els[i].style.height = `${Math.min(h, 100)}%`;
            els[i].style.top = `${i * 200}%`;
            scrollContainer.shadowRoot.appendChild(els[i]);
            observer.observe(els[i]);
        }
        els[0].id = "scroll-top";
        el.id = "scroll-bottom";
        scrollContainer.shadowRoot.appendChild(el);
        observer.observe(el);
    });
}

function handleIntersect(scrollContainer, entries) {
    entries.forEach(async entry => {
        const { x, y } = entry.boundingClientRect;
        const { previousX = 0, previousY = 0 } = entry.target;
        let [xDirection, yDirection] = [null, null];
        if (x < previousX) {
            xDirection = 'right';
        } else if (x > previousX) {
            xDirection = 'left';
        }

        if (y < previousY) {
            yDirection = 'down';
        } else if (y > previousY) {
            yDirection = 'up';
        }

        const onScrollElements = document.querySelectorAll("on-scroll");

        if ((entry.target.id === 'scroll-top') && (Math.round(entry.boundingClientRect.top) === 0)) {
            onScrollElements.forEach(node => node._scrollUpMax());
        }
        else if ((entry.target.id === 'scroll-bottom') && (entry.intersectionRatio >= 1)) {
            onScrollElements.forEach(node => node._scrollDownMax());
        }

        onScrollElements.forEach(node => {
            node._scrollAnyStart();
            if (xDirection) {
                node[HTMLToCamelCase(`_scroll-${xDirection}-start`)]();
            }
            if (yDirection) {
                node[HTMLToCamelCase(`_scroll-${yDirection}-start`)]();
            }
        });

        if (yDirection !== globalYDirection) {
            // console.log("scroll state change from", globalYDirection, "to", yDirection);
            globalYDirection = yDirection;
            waitForScrollEnd(scrollContainer, yDirection).then(deltaY => {
                if (Math.abs(deltaY) >= scrollStopThresholdY) {
                    onScrollElements.forEach(node => {
                        node._scrollAnyStop();
                        if (xDirection) {
                            node[HTMLToCamelCase(`_scroll-${xDirection}-stop`)]();
                        }
                        if (yDirection) {
                            node[HTMLToCamelCase(`_scroll-${yDirection}-stop`)]();
                        }
                    });
                }
                globalYDirection = null;
                // console.log("scroll stop", yDirection);
            }).catch(e => { /*console.log(e.message)*/ });
        }
        Object.assign(entry.target, { previousX: x, previousY: y })
    });
}

function waitForScrollEnd(scrollContainer, yDirection) {
    const {scrollLeft: xInitial, scrollTop: yInitial} = scrollContainer;
    let xPrevious = xInitial;
    let yPrevious = yInitial;
    let lastChangedFrame = 0;

    return new Promise((resolve, reject) => {
        function tick(frames) {
            if ((frames - lastChangedFrame) > 20) {
                resolve(scrollContainer.scrollTop - yInitial);
            } else if (frames >= 360) {
                reject(new Error(`wait for scroll ${yDirection} stop timed out`));
            } else if (yDirection !== globalYDirection) {
                reject(new Error(`wait for scroll ${yDirection} canceled`));
            }
            else {
                const {scrollLeft, scrollTop} = scrollContainer;
                if ((scrollLeft !== xPrevious) || (scrollTop !== yPrevious)) {
                    lastChangedFrame = frames;
                    xPrevious = scrollLeft;
                    yPrevious = scrollTop;
                }
                requestAnimationFrame(tick.bind(null, frames + 1));
            }
        }
        tick(0);
    });
}

window.addEventListener('DOMContentLoaded', () => init(document.querySelector('.on-scroll-container')))