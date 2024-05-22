import { GameComponent } from "./components/game-component";
import { userProvider } from "./services/user-provider";
import { ProfileComponent } from "./components/profile-component";
import { LeaderboardComponent } from "./components/leaderboard-component";

export class Manager {
    private userProvider = userProvider;

    constructor() {
        this.start();

        new GameComponent(document.getElementById("main-game"));
        new ProfileComponent(document.getElementById("main-profile"), userProvider.getUser());
        new LeaderboardComponent(document.getElementById("main-leaderboard"));
    }

    private start(): void {
        if (!this.userProvider.isAuthenticated()) {
            this.userProvider.register();
        }
    }
}