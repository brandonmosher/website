import { GitHTMLElement } from './git'; 
import css from './git-user.css';

customElements.define('git-user',
    class extends GitHTMLElement {
        type = 'user';
        get endpoint() {
            const userLogin = this.getAttribute('user-login');
            return `users/${userLogin}`;
        }
        shadowStyleInnerHTML = css;

        handlers = {
            'avatar_url,name,html_url': (avatarUrl, name, htmlUrl) => {
                const node = document.createElement('div');
                node.innerHTML =
                    `<img id="user-avatar-url" part="user-avatar-url" src="${avatarUrl}" alt="user avatar">
                    <div id="user-name-html-url" part="user-name-html-url">
                        <div id="user-name" part="user-name">${name}</div>
                        <a id="user-html-url" part="user-html-url" href="${htmlUrl}">${htmlUrl.split('/').slice(-1)[0]}</a>
                    </div>`;
                return node;
            },
            'bio': null,
            'public_repos,followers,following': null
        };
    }
);