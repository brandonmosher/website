import { GitHTMLElement } from "./git";
import css from "./git-repo.css";

customElements.define('git-repo',
    class extends GitHTMLElement {
        type = "repo";
        shadowStyleInnerHTML = css;

        get endpoint() {
            const repoOwner = this.getAttribute('repo-owner');
            const repoName = this.getAttribute('repo-name');
            return `repos/${repoOwner}/${repoName}`;
        }

        handlers = {
            'html_url': value => {
                const node = document.createElement('a');
                node.href = value;
                node.innerText = value.split('/').slice(-1)[0];
                return node;
            },
            'language': value => {
                const node = document.createElement('div');
                node.classList.add(value);
                node.innerText = value;
                return node;
            },
            'description': null,
            'stargazers_count': null,
            'watchers_count': null,
            'forks_count': null
        }
    }
);