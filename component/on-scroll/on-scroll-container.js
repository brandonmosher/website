import { HTMLToCamelCase } from "Lib/capitalization";
import { textToTemplate } from "Lib/textToTemplate";
import css from "./on-scroll-container.css";
import html from "./on-scroll-container.html";

const template = textToTemplate(css, html);

let globalYDirection = null;

function waitForScrollEnd(scrollContainer, yDirection) {
    const xInitial = scrollContainer.scrollLeft;
    const yInitial = scrollContainer.scrollTop;
    let xPrevious = xInitial;
    let yPrevious = yInitial;
    let lastChangedFrame = 0;

    return new Promise((resolve, reject) => {
        function tick(frames) {
            // We requestAnimationFrame either for 500 frames or until 20 frames with
            // no change have been observed.
            if ((frames >= 500) || (frames - lastChangedFrame > 20)) {
                resolve(scrollContainer.scrollTop - yInitial);
            } else if (yDirection !== globalYDirection) {
                reject(new Error(`scroll ${yDirection} canceled`));
            }
            else {
                if ((scrollContainer.scrollLeft != xPrevious) || (scrollContainer.scrollTop != yPrevious)) {
                    lastChangedFrame = frames;
                    xPrevious = scrollContainer.scrollLeft;
                    yPrevious = scrollContainer.scrollTop;
                }
                requestAnimationFrame(tick.bind(null, frames + 1));
            }
        }
        tick(0);
    });
}

const thresholdArray = steps => Array(steps + 1)
    .fill(0)
    .map((_, index) => index / steps || 0);

const scrollStopThresholdY = 0; //(window.innerHeight / 8);

function handleIntersect(entries) {
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

        const onScrollContainer = entry.target.getRootNode().host;
        const onScrollElements = onScrollContainer.querySelectorAll("on-scroll");

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
            waitForScrollEnd(onScrollContainer, yDirection).then(deltaY => {
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
                // console.log("scroll stop", yDirection, deltaY);
            }).catch(e => console.log(e.message));
        }
        Object.assign(entry.target, { previousX: x, previousY: y })
    })
}

customElements.define("on-scroll-container",
    class extends HTMLElement {
        constructor() {
            super();
            const shadowRoot = this.attachShadow({ mode: 'open' })
                .appendChild(template.content.cloneNode(true));
            const observer = new IntersectionObserver(
                handleIntersect, {
                threshold: thresholdArray(10)
            })
            const viewportHeight = Math.min(this.clientHeight, window.innerHeight);
            let remainingHeight = this.scrollHeight;
            for (let i = 0; remainingHeight > 0; ++i, remainingHeight -= 2 * viewportHeight) {
                const el = document.createElement("div");
                const sentryHeight = `${Math.max(0, Math.min(remainingHeight, viewportHeight))}px`;
                el.style.height = sentryHeight;
                el.style.position = 'absolute';
                el.style.top = `${i * 2 * viewportHeight}px`;
                el.style.left = '0';
                el.style.right = '0';
                // el.style.border = '1px solid red';
                // el.style.zIndex = 5;
                el.style.visibility = 'hidden';
                this.shadowRoot.appendChild(el);
                observer.observe(el);
            }
        }
    }
);
