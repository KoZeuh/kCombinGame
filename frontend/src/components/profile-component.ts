import { User } from "../interfaces/user";
import { userProvider } from "../services/user-provider";


export class ProfileComponent {
    private elements: ProfileComponentElements;
    private userProvider = userProvider;

    constructor(container: HTMLElement, user: User) {
        this.buildElements(container);
        this.updateData(user);
        this.bindEvents();
    }

    private buildElements(container: HTMLElement): void {
        this.elements = {
            container: container,
            username: document.getElementById('profile-username'),
            score: document.getElementById('current-score'),
            level: document.getElementById('current-level'),
            disconnectBtn: document.getElementById('disconnect-btn') as HTMLButtonElement,
        };
    }

    private bindEvents(): void {
        this.elements.disconnectBtn.addEventListener('click', () => {
            this.userProvider.disconnect();
        });
    }

    async updateData(user) {
        this.elements.username.innerText = user.username;
        this.elements.score.innerText = user.score.toString();
        this.elements.level.innerText = user.level.toString();
    }
}

interface ProfileComponentElements {
    container: HTMLElement;
    username: HTMLSpanElement;
    score: HTMLSpanElement;
    level: HTMLSpanElement;
    disconnectBtn: HTMLButtonElement
}