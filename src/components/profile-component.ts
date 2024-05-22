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
            totalScore: document.getElementById('current-score'),
            level: document.getElementById('current-level'),
            removeAccountBtn: document.getElementById('remove-account-btn') as HTMLButtonElement,
        };
    }

    private bindEvents(): void {
        this.elements.removeAccountBtn.addEventListener('click', () => {
            this.userProvider.removeAccount();
        });
    }

    async updateData(user) {
        this.elements.username.innerText = user.username;
        this.elements.totalScore.innerText = user.score.toString();
        this.elements.level.innerText = user.level.toString();
    }
}

interface ProfileComponentElements {
    container: HTMLElement;
    username: HTMLSpanElement;
    totalScore: HTMLSpanElement;
    level: HTMLSpanElement;
    removeAccountBtn: HTMLButtonElement
}