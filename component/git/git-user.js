import { GitHTMLElement } from "./git"; 
import css from "./git-user.css";

customElements.define('git-user',
    class extends GitHTMLElement {
        type = 'user';
        get endpoint() {
            const userLogin = this.getAttribute('user-login');
            return `users/${userLogin}`;
        }
        shadowStyleInnerHTML = css;

        handlers = {
            'name': null,
            'html_url': value => {
                const node = document.createElement('a');
                node.href = value;
                node.innerText = value.split('/').slice(-1)[0];
                return node;
            },
            'bio': null,
            'avatar_url': value => {
                const node = document.createElement('img');
                node.src = value;
                node.alt = 'user avatar';
                return node;
            },
            'followers': null,
            'following': null,
            'public_repos': null
        };
    }
);