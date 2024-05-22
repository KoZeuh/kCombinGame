import { RegisterComponent } from "../components/register-component";
import { User } from "../interfaces/user";
import axios from 'axios';

class UserProvider {
    private apiUpdateUrl = 'http://localhost:3000/user/update';
    private apiGetUserUrl = 'http://localhost:3000/user/get';
    private apiRegisterUrl = 'http://localhost:3000/user/create';

    private static readonly storageKey = "userId";
    private user?: User;
    private registerComponent = new RegisterComponent(document.getElementById("register-modal") as HTMLDialogElement);

    async loadFromStorage(): Promise<void> {
        const userId = localStorage.getItem(UserProvider.storageKey);

        if (userId) {
            const response = await axios.get(`${this.apiGetUserUrl}/${userId}`);
            this.user = response.data;
        }
    }

    getUser(): User | null {
        return this.user || null;
    }

    isAuthenticated(): boolean {
        return !!(this.user);
    }

    async register(): Promise<void> {
        let user = await this.registerComponent.runRegister();
        const response = await axios.post(this.apiRegisterUrl, user);

        user = response.data;
        localStorage.setItem(UserProvider.storageKey, user._id);
        this.user = user;
    }

    async save(user: User): Promise<void> {
        await axios.post(this.apiUpdateUrl, user);
        this.user = user;
    }

    async updateUserLevelAndScore(level: number, score: number): Promise<void> {
        this.user.level = level;
        this.user.score = score;

        await this.save(this.user);
    }

    disconnect(): void {
        localStorage.removeItem(UserProvider.storageKey);
        this.user = undefined;
        document.location.reload();
    }
}

export const userProvider = new UserProvider();
