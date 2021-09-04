import "./index.css";
import "./style/font.css";
import "./style/structure.css";
import "./style/backgrounds.css";
import "./style/scroll.css";
import "./style/intro.css";
import "./style/resume.css";
import "./style/skills.css";
import "./style/projects.css";
import "./style/experience.css";
import "./style/contact-form.css";

import "element-internals-polyfill";

import "Component/on-intersection-set-class";
import "Component/nav";
import "Component/progress-bar";
import "Component/git";
import "Component/form-control";
import "Component/on-scroll/on-scroll.js"

import "Lib/parallax";
import "Lib/on-scroll"

const resumeUrl = 'https://raw.githubusercontent.com/brandonmosher/resume/main/build/resume-website/resume-website.pdf';
const resumeJsonUrl = 'https://raw.githubusercontent.com/brandonmosher/resume/main/build/resume-website/resume-website.json';
const formSubmitUrl = 'https://lmzel5xwlf.execute-api.us-east-1.amazonaws.com/live';

background: {
    window.addEventListener('load', () => {
        setTimeout(
            ()=>document.querySelector('#parallax-layer-2').style.setProperty('opacity', '1'),
            100);
    });
}

form: {
    const form = document.querySelector('form');
    form.action = formSubmitUrl;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        form.querySelectorAll('form-control:not([type=submit])').forEach((node, i, arr) => {
            node.style.display = 'none';
        });
        document.querySelector('form-control[type=submit]').innerText = 'Thank You!';
    });
}

content: {
    const makeId = name => name.toLowerCase().replace(/(\+|\(|\))/g, '').replace(/,| /g, '-').replace(/-{2,}/g, '-')

    const resumeHTML = (cvparagraph) =>
        `<on-intersection-set-class id="resume-container" class="content-container" enter-any-add-class="ready">
            <p id="resume-summary-container">${cvparagraph}</p>
            <div id="resume-download-container">
                <a id="resume-download-button"
                    href="${resumeUrl}"
                    target="_blank" rel="noopener noreferrer" data-type="document">
                    <h4>Download Resume</h4>
                </a>
            </div>
        </on-intersection-set-class>`;

    const makeSkillId = (name) => `progress-bar-${makeId(name)}`;

    const skillsHTML = (cventries) => {
        const skillHTML = ({ name, proficiencyPercentage } = {}) =>
            `<progress-bar-borderless id="${makeSkillId(name)}" proficiency-percentage="${proficiencyPercentage}"><h4>${name}</h4></progress-bar-borderless>`;
        return `<on-intersection-set-class threshold="0.75" id="intersection-skills" class="content-container"
                query-selector="progress-bar-container" enter-any-add-class="ready">
                <progress-bar-container>
                    ${cventries.reduce((innerHTML, cvskill) => innerHTML + skillHTML(cvskill), '')}
                </progress-bar-container>
            </on-intersection-set-class>`;
    }

    const skillsCSS = (cventries) => {
        const skillCSS = ({ i, name, proficiencyPercentage } = {}) =>
            `progress-bar-container.ready #${makeSkillId(name)} {--bar-completed-percentage: ${parseInt(proficiencyPercentage)}; transition-delay: ${0.15 * i}s}`;
        return cventries.reduce((skillsCSS, cvskill, i) => skillsCSS + skillCSS({ i, ...cvskill }), '');
    }

    const projectsHTML = (cventries) => {
        const projectHTML = ({ url, name, cvparagraph, gitHubRepoName } = {}) => {
            if (gitHubRepoName) {
                const [repoOwner, repoName] = gitHubRepoName.split('/');
                return `<git-repo repo-owner="${repoOwner}"" repo-name="${repoName}"></git-repo>`;
            }
            return `<project id="project-${makeId(name)}"><a href="${url}">${name}</a><div>${cvparagraph}</div></project>`
        }
        return `<on-intersection-set-class id="projects-container" class="content-container" query-selector="git-user,git-repo,project" enter-any-add-class="ready">
                    <git-user user-login="brandonmosher"></git-user>
                    ${cventries.reduce((projectsHTML, cvproject) => projectsHTML + projectHTML(cvproject), '')}
                </on-intersection-set-class>`
    }

    const experiencesHTML = (cventries) => {
        const experienceHTML = ({ startDate, endDate, organization, jobTitle, cvitems } = {}) =>
            `<on-intersection-set-class threshold="0.25" enter-bottom-add-class="bounce">
                <vertical-timeline-entry>
                    <h4>${startDate} - ${endDate}</h4>
                    <hr>
                    <div>
                        <h5>${organization}</h5>
                        <h6>${jobTitle}</h6>
                        <br>
                        <p>${cvitems}</p>
                    </div>
                </vertical-timeline-entry>
            </on-intersection-set-class>`;
        return `<vertical-timeline>
                ${cventries.reduce((experienceInnerHTML, cventry) =>
            experienceInnerHTML + experienceHTML({ ...cventry, cvitems: cventry.cvitems.join(" ") }), '')}
            </vertical-timeline>`;
    }

    fetch(resumeJsonUrl)
        .then(response => response.json())
        .then(json => {
            css: {
                const style = document.createElement('style');
                style.innerHTML = skillsCSS(json.document.cv.skills.cventries);
                document.head.appendChild(style);
            }

            html: {
                document.querySelector('#resume > div').innerHTML += resumeHTML(json.document.cv.summary.cvparagraph);
                document.querySelector('#skills > div').innerHTML += skillsHTML(json.document.cv.skills.cventries);;
                document.querySelector('#projects > div').innerHTML += projectsHTML(json.document.cv.projects.cventries);
                document.querySelector('#experience > div').innerHTML += experiencesHTML(json.document.cv.experience.cventries);
            }

            progressBar: {
                const pbContainer = document.querySelector('progress-bar-container');

                if (CSS.registerProperty) {
                    pbContainer.lastChild.addEventListener('transitionend', (e) => pbContainer.classList.add('done'));
                }
                else {
                    const intersectionSkills = document.querySelector('#intersection-skills');
                    const pbAnimate = () => {
                        function AnimateProgressBarFactory(bar, start, end, delta, delay) {
                            const set = (value) => bar.style.setProperty('--bar-completed-percentage', value);
                            return function animate() {
                                if (start <= end) {
                                    if (delay) {
                                        --delay;
                                    }
                                    else {
                                        set(start);
                                        start += delta;
                                    }
                                    requestAnimationFrame(animate);
                                }
                                else {
                                    set(end);
                                }
                            }
                        }
                        Array.from(pbContainer.children).forEach((pb, i) =>
                            AnimateProgressBarFactory(pb, 0, parseInt(pb.getAttribute('proficiency-percentage')), 3, 5 * (i + 1))());

                        intersectionSkills.removeEventListener('enterany', pbAnimate);
                    }

                    intersectionSkills.addEventListener('enterany', pbAnimate);
                }

                const resizeCallback = () => {
                    const ready = pbContainer.classList.contains('ready');
                    if (CSS.registerProperty) {
                        pbContainer.classList.remove('init');
                        pbContainer.classList.add('ready');
                        pbContainer.centerProgressBars();
                        pbContainer.classList.toggle('ready', ready);
                        pbContainer.classList.add('init');
                    }
                    else {
                        const pbs = Array.from(pbContainer.children);

                        if (!ready) {
                            pbs.forEach(pb =>
                                pb.style.setProperty('--bar-completed-percentage', pb.getAttribute('proficiency-percentage')));
                        }

                        pbContainer.centerProgressBars();

                        if (!ready) {
                            pbs.forEach(pb =>
                                pb.style.setProperty('--bar-completed-percentage', '0'));
                        }
                    }
                }

                resizeCallback();
                let resizeTimer;
                window.addEventListener('resize', (e) => {
                    clearTimeout(resizeTimer);
                    resizeTimer = setTimeout(resizeCallback, 50);
                });
            }
        });
}