import { User } from '../interfaces/user';
import { userProvider } from '../services/user-provider';
import { Card } from '../interfaces/card';

export class GameComponent {
    private cards: Card[] = [];
    private resultsArray: string[] = [];
    private counter: number = 0;
    private seconds: number = 0;
    private tens: number = 0;
    private Interval: number | undefined;
    private user: User;
    private userProvider = userProvider;
    private myCards: HTMLElement;
    private appendTens: HTMLElement;
    private appendSeconds: HTMLElement;
    private minTimePerLevel: number = 60; // minimal time to complete a level to get bonus
    private isPlaying: boolean = true;

    constructor(gameElement: HTMLElement | null) {
        if (!gameElement) {
            throw new Error('Game element not found');
        }

        this.myCards = gameElement;
        this.appendTens = document.getElementById("tens")!;
        this.appendSeconds = document.getElementById("seconds")!;

        this.initializeGame();
        this.addPauseButtonListener();
    }

    private async initializeGame(): Promise<void> {
        this.user = this.userProvider.getUser();

        const images = [];

        for (let i = 1; i <= 70; i++) {
            images.push(i);
        }

        let levelPairs = this.user.level + 1; // Increase pairs based on level (starting from 2 pairs)

        if (levelPairs > 24) {
            levelPairs = 24; // Maximum pairs
        }

        const selectedImages = images.slice(0, levelPairs);
        const cards = selectedImages.concat(selectedImages); // Create pairs

        this.shuffle(cards);
        this.createCards(cards);
        this.resetTimer();
        this.updateUI();
    }

    private shuffle(array: string[]): void {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    private createCards(cards: string[]): void {
        this.myCards.innerHTML = ''; // Clear previous cards

        cards.forEach((cardId) => {
            const cardElement = document.createElement('div');
            cardElement.dataset.item = cardId;
            cardElement.dataset.view = "card";
            this.myCards.appendChild(cardElement);

            cardElement.addEventListener('click', () => this.onCardClick(cardElement));
        });
    }

    private onCardClick(cardElement: HTMLElement): void {
        if (!this.isPlaying) return;

        if (!cardElement.classList.contains('flipped') && !cardElement.classList.contains('correct')) {
            cardElement.classList.add('flipped');
            const result = cardElement.dataset.item!;
            this.resultsArray.push(result);
            clearInterval(this.Interval);
            this.Interval = window.setInterval(() => this.startTimer(), 10);

            if (this.resultsArray.length > 1) {
                if (this.resultsArray[0] === this.resultsArray[1]) {
                    this.check("correct");
                    this.counter++;
                    this.resultsArray = [];
                    this.win();
                } else {
                    this.check("reverse");
                    this.resultsArray = [];
                }
            }
        }
    }

    private check(className: string): void {
        const x = document.getElementsByClassName("flipped");

        setTimeout(() => {
            for (let i = x.length - 1; i >= 0; i--) {
                x[i].className = className;
            }
        }, 500);
    }

    private async win(): Promise<void> {
        if (this.counter === this.myCards.children.length / 2) {
            clearInterval(this.Interval);
            setTimeout(async () => {
                this.nextLevel();
            }, 500);
        }
    }

    private async nextLevel(): Promise<void> {
        let bonus = 0;
        const timeTaken = this.seconds + this.tens / 100;
        if (timeTaken < this.minTimePerLevel) {
            bonus = (this.minTimePerLevel - timeTaken) * 10; // Bonus points based on time saved
        }
        this.user.score += 100 + bonus;
        this.user.level++;
        await this.userProvider.updateUserLevelAndScore(this.user.level, this.user.score);
        this.resetGame();
    }

    private resetGame(): void {
        this.counter = 0;
        this.resultsArray = [];
        this.initializeGame();
    }

    private startTimer(): void {
        if (!this.isPlaying) return;

        this.tens++;

        if (this.tens < 9) {
            this.appendTens.innerHTML = "0" + this.tens;
        }

        if (this.tens > 9) {
            this.appendTens.innerHTML = "" + this.tens;
        }

        if (this.tens > 99) {
            this.seconds++;
            this.appendSeconds.innerHTML = "0" + this.seconds;
            this.tens = 0;
            this.appendTens.innerHTML = "00";
        }

        if (this.seconds > 9) {
            this.appendSeconds.innerHTML = "" + this.seconds;
        }
    }

    private resetTimer(): void {
        this.tens = 0;
        this.seconds = 0;
        this.appendTens.innerHTML = "00";
        this.appendSeconds.innerHTML = "00";
    }

    private updateUI(): void {
        document.getElementById("current-level")!.innerHTML = this.user.level.toString();
        document.getElementById("current-score")!.innerHTML = this.user.score.toString();
    }

    private addPauseButtonListener(): void {
        const pauseButton = document.getElementById("pause-game-btn");
        if (pauseButton) {
            pauseButton.addEventListener('click', () => this.togglePause());
        }
    }

    private togglePause(): void {
        this.isPlaying = !this.isPlaying;

        if (!this.isPlaying) {
            clearInterval(this.Interval);
        } else {
            this.Interval = window.setInterval(() => this.startTimer(), 10);
        }
    }
}
