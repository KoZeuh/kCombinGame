import { User } from "./user";

export interface Game {
    user: User;
    time: Date;
    totalScore: number;
    level: number;
}