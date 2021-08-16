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
            'html_url': htmlUrl => {
                const node = document.createElement('a');
                node.href = htmlUrl;
                node.innerText = htmlUrl.split('/').slice(-1)[0];
                return node;
            },
            'language': language => {
                const node = document.createElement('div');
                node.classList.add(language);
                node.innerText = language;
                return node;
            },
            'description': null,
            'stargazers_count': null,
            'watchers_count': null,
            'forks_count': null
        }
    }
);