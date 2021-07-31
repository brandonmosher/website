import { underscoreToHTMLCase } from "Lib/capitalization"
export class GitHTMLElement extends HTMLElement {
    type = null;
    hostname = 'https://api.github.com';
    token = null;
    get endpoint() { return ''; }
    handlers = null;
    shadowStyleInnerHTML = '';

    connectedCallback() {
        // if(!this.hasAttribute('slot')) {
        //     this.setAttribute('slot', this.type);
        // }
        if (!this.shadowRoot) {
            this.init();
        }
    }

    async init() {
        const fragment = document.createDocumentFragment();
        this.shadowStyle = document.createElement('style');
        this.shadowStyle.innerHTML = this.shadowStyleInnerHTML;
        fragment.appendChild(this.shadowStyle);

        const headers = {};
        if (this.token) {
            headers['Authorization'] = `token ${this.token}`;
        }
        fetch(`${this.hostname}/${this.endpoint}`, { headers })
            .then(async response => {
                if (!response.ok) {
                    await response.text().then(text => {
                        const errorContainer = document.createElement('div');
                        errorContainer.id = 'error-container';
                        const errorMessage = document.createElement('p');
                        errorMessage.id = 'error-message';
                        errorMessage.innerText = JSON.parse(text).message;
                        fragment.appendChild(errorContainer).appendChild(errorMessage);
                    });
                }
                else {
                    await response.json().then(data => {
                        this.gridContainer = document.createElement('div');
                        this.gridContainer.id = 'grid-container';
                        this.gridContainer.setAttribute('part', 'grid-container');
                        fragment.appendChild(this.gridContainer);

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
                    })
                }
            })
            .finally(() => {
                const shadowRoot = this.attachShadow({ mode: 'open' });
                shadowRoot.appendChild(fragment);
                this.dispatchEvent(new Event('load'));
            });
    }
}