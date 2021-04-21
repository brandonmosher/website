class MutationObserverState {
    mutationObserver = null;
    targetNodeOptions = new Map();

    constructor(mutationCallback) {
        this.mutationObserver = new MutationObserver(mutationCallback)
    }

    observe(targetNode, options) {
        let targetNodeOptions = this.targetNodeOptions.get(targetNode);
        if(targetNodeOptions) {
            if(this.targetNodeOptions.size > 1) {
                this.unobserve(targetNode);
            }
        }
        this.targetNodeOptions.set(targetNode, options);
        this.mutationObserver.observe(targetNode, options);
    }

    unobserve(targetNode) {
        this.mutationObserver.disconnect();
        this.targetNodeOptions.delete(targetNode);
        this.targetNodeOptions.forEach((options, targetNode) => {
            this.mutationObserver.observe(targetNode, options);
        });
    }

    get numTargetNodes() {
        return this.targetNodeOptions.size;
    }
}

export class MutationObserverPool {
    static mutationCallbackObserverStates = new Map();

    static unobserve(mutationCallback, targetNode) {
        const mutationObserverState = MutationObserverPool.mutationCallbackObserverStates.get(mutationCallback);
        if(mutationObserverState) {
            mutationObserverState.unobserve(targetNode);
            if(!mutationObserverState.numTargetNodes) {
                MutationObserverPool.mutationCallbackObserverStates.delete(mutationCallback);
            }
        }
    }

    static observe(mutationCallback, targetNode, options) {
        let mutationObserverState = MutationObserverPool.mutationCallbackObserverStates.get(mutationCallback);
        if(!mutationObserverState) {
            mutationObserverState = new MutationObserverState(mutationCallback);
            MutationObserverPool.mutationCallbackObserverStates.set(mutationCallback, mutationObserverState);
        }
        mutationObserverState.observe(targetNode, options);
    }

    static get numObservers() {
        return this.mutationCallbackObserverStates.size;
    }
}
