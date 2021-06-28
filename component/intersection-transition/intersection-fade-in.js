import { IntersectionTransitionFactory } from "/component/intersection-transition/intersection-transition-factory.js"

IntersectionTransitionFactory({
    tagName: "intersection-fade-in",
    intersectionRatio: 0.25,
    transitions: "opacity 2s 0 1"
});
