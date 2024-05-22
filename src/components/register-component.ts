import { User } from "../interfaces/user";

export class RegisterComponent {
    private elements: RegisterComponentElements;
    private promiseResolve: (value: (PromiseLike<User> | User)) => void;

    constructor(container: HTMLDialogElement) {
        this.buildElements(container);
        this.bindEvents();
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
            form: container.querySelector('form'),
        };
    }

    private bindEvents() {
        this.elements.form.addEventListener("submit", e => {
            e.preventDefault();
            this.finish();
        });
    }

    private async finish() {
        const payload = new FormData(this.elements.form);

        const user = {
            username: payload.get("username").toString(),
            level: 1,
            score: 0
        };

        this.elements.container.close();
        this.promiseResolve(user);
        document.location.reload();
    }
}

interface RegisterComponentElements {
    container: HTMLDialogElement;
    form: HTMLFormElement;
}