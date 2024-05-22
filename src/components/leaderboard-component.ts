import { LeaderboardEntry } from '../interfaces/leaderboard-entry';
export class LeaderboardComponent {
    private elements: LeaderboardComponentElements;

    leaderboardEntries: LeaderboardEntry[] = [
        { rank: 1, name: 'Alex HMorrision', score: 38, level: 980, avatarUrl: 'https://i.pravatar.cc/155?u=a042581f4e29026704d' },
        { rank: 2, name: 'Alex HMorrision', score: 38, level: 980, avatarUrl: 'https://i.pravatar.cc/155?u=a042581f4e29026704d5' },
        { rank: 3, name: 'Alex HMorrision', score: 38, level: 980, avatarUrl: 'https://i.pravatar.cc/155?u=a042581f4e29026704dx' },
    ];

    constructor(container: HTMLElement) {
        this.buildElements(container);
        this.populateLeaderboard(this.leaderboardEntries);
    }

    private buildElements(container: HTMLElement): void {
        this.elements = {
            leaderboard: container.querySelector('#leaderboard') as HTMLElement,
            additionalLeaderboard: container.querySelector('#additional-leaderboard') as HTMLElement,
        };
    }

    private populateLeaderboard(entries: LeaderboardEntry[]) {
        const template = document.getElementById('leaderboard-template') as HTMLTemplateElement;
        const leaderboardContainer = document.getElementById('leaderboard');
        const additionalLeaderboardContainer = document.getElementById('additional-leaderboard');

        entries.forEach((entry, index) => {
            const clone = template.content.cloneNode(true) as HTMLElement;
            const img = clone.querySelector('img')!;
            const name = clone.querySelector('h4')!;
            const rank = clone.querySelector('span')!;
            const score = clone.querySelector('.stats div:first-child span:last-child')!;
            const level = clone.querySelector('.stats div:last-child span:last-child')!;

            img.src = entry.avatarUrl;
            name.textContent = entry.name;
            rank.textContent = `#${entry.rank}`;
            score.textContent = entry.score.toString();
            level.textContent = entry.level.toString();

            if (index === 0) {
                leaderboardContainer!.appendChild(clone);
            } else {
                additionalLeaderboardContainer!.appendChild(clone);
            }
        });
    }
}

interface LeaderboardComponentElements {
    leaderboard: HTMLElement;
    additionalLeaderboard: HTMLElement;
}