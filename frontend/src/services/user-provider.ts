import { RegisterComponent } from "../components/register-component";
import { User } from "../interfaces/user";
import axios from 'axios';

class UserProvider {
    private apiUrl = 'http://localhost:3000/users';
    private static readonly storageKey = "user";
    private user?: User;
    private registerComponent = new RegisterComponent(document.getElementById("register-modal") as HTMLDialogElement);

    constructor() {
        this.loadFromStorage();
    }

    async isAuthenticated(): Promise<boolean> {
        const user = await this.getUser();
        return !!user;
    }

    async register(): Promise<void> {
        const user = await this.registerComponent.runRegister();
        await this.save(user);
    }

    removeAccount(): void {
        localStorage.removeItem(UserProvider.storageKey);
        document.location.reload();
    }

    async getUser(): Promise<User | null> {
        if (this.user) {
            return this.user;
        }

        const userData = localStorage.getItem(UserProvider.storageKey);
        if (userData) {
            this.user = JSON.parse(userData);
            return this.user;
        }

        return null;
    }

    private async loadFromStorage(): Promise<void> {
        const userData = localStorage.getItem(UserProvider.storageKey);
        if (userData) {
            this.user = JSON.parse(userData);

            if (this.user && this.user._id) {
                await axios.put(`${this.apiUrl}/${this.user._id}`, this.user);
            }

            console.log('User loaded from storage', this.user);
        }
    }

    async save(user: User): Promise<void> {
        if (user._id) {
            await axios.put(`${this.apiUrl}/${user._id}`, user);
        } else {
            const response = await axios.post(this.apiUrl, user);
            user._id = response.data._id;
            localStorage.setItem(UserProvider.storageKey, JSON.stringify(user));
        }
        this.user = user;
    }

    async updateUserLevelAndScore(level: number, score: number): Promise<void> {
        const user = await this.getUser();
        if (user) {
            user.level = level;
            user.score = score;
            await this.save(user);
        }
    }
}

export const userProvider = new UserProvider();
