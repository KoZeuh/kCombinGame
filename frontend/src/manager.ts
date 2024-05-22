import { GameComponent } from './components/game-component';
import { LeaderboardComponent } from './components/leaderboard-component';
import { ProfileComponent } from './components/profile-component';
import { userProvider } from './services/user-provider';

export class Manager {
    private userProvider = userProvider;

    constructor() {
        this.start();
    }

    private async start(): Promise<void> {
        const isAuthenticated = await this.userProvider.isAuthenticated();
        
        if (!isAuthenticated) {
            await this.userProvider.register();
        }

        const user = await this.userProvider.getUser();

        if (user) {
            new GameComponent(document.getElementById("main-game"));
            new LeaderboardComponent(document.getElementById("main-leaderboard"));
            new ProfileComponent(document.getElementById("main-profile"), user);
        }
    }
}
