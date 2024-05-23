import { User } from "../interfaces/user";

export class RegisterComponent {
    private elements: RegisterComponentElements;
    private promiseResolve: (value: (PromiseLike<User> | User)) => void;

    constructor(container: HTMLDialogElement) {
        this.buildElements(container);
        this.bindEvents();
        this.disableClosableModal();
    }

    runRegister(): Promise<User> {
        return new Promise((resolve) => {
            this.promiseResolve = resolve;
            this.elements.container.showModal();
        });
    }

    private buildElements(container: HTMLDialogElement): void {
        this.elements = {
            container: container,
            form: container.querySelector('form')!,
        };
    }

    private bindEvents() {
        this.elements.form.addEventListener("submit", e => {
            e.preventDefault();
            this.finish();
        });
    }

    private disableClosableModal() {
        this.elements.container.addEventListener('cancel', (event) => {
            event.preventDefault();
        });

        this.elements.container.addEventListener('click', (event) => {
            const rect = this.elements.container.getBoundingClientRect();
            const isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height && rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
                                
            if (!isInDialog) {
                event.stopPropagation();
            }
        });

        window.addEventListener('keydown', this.preventEscapeKey);
    }

    private preventEscapeKey(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            event.preventDefault();
        }
    }

    private async finish() {
        const payload = new FormData(this.elements.form);
        const username = payload.get("username")?.toString().trim();

        if (!username) {
            alert("Please enter a valid username");
            return;
        }

        const user: User = {
            username: username,
            level: 1,
            score: 0
        };

        this.elements.container.close();
        this.promiseResolve(user);
    }
}

interface RegisterComponentElements {
    container: HTMLDialogElement;
    form: HTMLFormElement;
}
