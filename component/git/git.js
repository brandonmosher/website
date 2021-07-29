import { underscoreToHTMLCase } from "Lib/capitalization"
export class GitHTMLElement extends HTMLElement {
    type = null;
    hostname = 'https://api.github.com';
    token = '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';
    get endpoint() { return ''; }
    handlers = null;
    shadowStyleInnerHTML = '';

    connectedCallback() {
        // if(!this.hasAttribute('slot')) {
        //     this.setAttribute('slot', this.type);
        // }
        const fragment = document.createDocumentFragment();

        

        this.shadowStyle = document.createElement('style');
        this.shadowStyle.innerHTML = this.shadowStyleInnerHTML;
        fragment.appendChild(this.shadowStyle);

        this.gridContainer = document.createElement('div');
        this.gridContainer.id = 'grid-container';
        this.gridContainer.setAttribute('part', 'grid-container');
        fragment.appendChild(this.gridContainer);

        this.getData(fragment);
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(fragment);
        
    }

    async getData() {
        const data = await fetch(`${this.hostname}/${this.endpoint}`, {
            headers: {
                Authorization: `token ${this.token}`
            }
        }).then(r => r.json());
        Object.entries(this.handlers).forEach(([key, handler]) => {
            const id = `${this.type}-${underscoreToHTMLCase(key)}`;
            let node;
            if (handler) {
                node = handler(data[key]);
            }
            else {
                node = document.createElement('div');
                node.innerText = data[key];
            }
            node.id = id;
            node.setAttribute('part', id);
            this.gridContainer.appendChild(node);
        });
    }
}