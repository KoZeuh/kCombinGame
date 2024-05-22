import { LeaderboardEntry } from '../interfaces/leaderboard-entry';
import axios from 'axios';

export class LeaderboardComponent {
    private apiURL = 'http://localhost:3000/leaderboard';
    private elements: LeaderboardComponentElements;

    constructor(container: HTMLElement) {
        this.buildElements(container);
        this.fetchLeaderboardData();
    }

    private buildElements(container: HTMLElement): void {
        this.elements = {
            leaderboard: container.querySelector('#leaderboard') as HTMLElement,
            additionalLeaderboard: container.querySelector('#additional-leaderboard') as HTMLElement,
        };
    }

    private async fetchLeaderboardData() {
        try {
            const response = await axios.get(this.apiURL);
            const leaderboardEntries = response.data.map((entry, index) => ({
                rank: index + 1,
                username: entry.username,
                score: entry.score,
                level: entry.level,
                avatarUrl: `https://i.pravatar.cc/155?u=${entry._id}`
            }));

            this.populateLeaderboard(leaderboardEntries);
        } catch (error) {
            console.error('Error fetching leaderboard data:', error);
        }
    }

    private populateLeaderboard(entries: LeaderboardEntry[]) {
        const template = document.getElementById('leaderboard-template') as HTMLTemplateElement;
        const leaderboardContainer = this.elements.leaderboard;
        const additionalLeaderboardContainer = this.elements.additionalLeaderboard;

        entries.forEach((entry, index) => {
            const clone = template.content.cloneNode(true) as HTMLElement;
            const img = clone.querySelector('img')!;
            const name = clone.querySelector('h4')!;
            const rank = clone.querySelector('span')!;
            const score = clone.querySelector('.stats div:first-child span:last-child')!;
            const level = clone.querySelector('.stats div:last-child span:last-child')!;

            img.src = entry.avatarUrl;
            name.textContent = entry.username;
            rank.textContent = `#${entry.rank}`;
            score.textContent = entry.score.toString();
            level.textContent = entry.level.toString();

            if (index === 0) {
                leaderboardContainer.appendChild(clone);
            } else {
                additionalLeaderboardContainer.appendChild(clone);
            }
        });
    }
}

interface LeaderboardComponentElements {
    leaderboard: HTMLElement;
    additionalLeaderboard: HTMLElement;
}
