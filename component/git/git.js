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

        this.attachShadow({ mode: 'open' });

        this.shadowStyle = document.createElement('style');
        this.shadowStyle.innerHTML = this.shadowStyleInnerHTML;
        this.shadowRoot.appendChild(this.shadowStyle);

        this.gridContainer = document.createElement('div');
        this.gridContainer.id = 'grid-container';
        this.gridContainer.setAttribute('part', 'grid-container');
        this.shadowRoot.appendChild(this.gridContainer);

        this.getData();
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