import { IntersectionTransitionFactory } from "/component/intersect-transition/intersect-transition-factory.js"

IntersectionTransitionFactory({
    tagName: "intersect-fade-in",
    intersectionRatio: 0.25,
    transition: "opacity 2s",
    transitionPropertyValues: "0 1",
});
