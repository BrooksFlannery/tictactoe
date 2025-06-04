import { drizzle } from 'drizzle-orm/postgres-js';
import type { MatchAPI } from "../api.ts";
import { InitGameState, InitMatchState, type MatchState, type MoveCoords, move } from "../gameEngine.ts";
import { matchesTable } from "./schema.ts";
import { eq } from "drizzle-orm";

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable isnt set');
}
const db = drizzle(process.env.DATABASE_URL)

export class DbMatchApi implements MatchAPI {
    async resetGame(matchId: string): Promise<MatchState> {
        const [match] = await db
            .select()
            .from(matchesTable)
            .where(eq(matchesTable.matchId, matchId));
        if (!match) throw new Error("Game not found");

        const newMatch = {
            ...match,
            game: InitGameState(),
        };

        await db.update(matchesTable)
            .set({
                game: newMatch.game,
                xScore: newMatch.xScore,
                oScore: newMatch.oScore,
            })
            .where(eq(matchesTable.matchId, matchId));

        return newMatch as MatchState;
    }

    async createMatch(): Promise<MatchState> {
        const match = InitMatchState();

        await db.insert(matchesTable)
            .values(match); 
        return match;
    }

    async getMatch(matchId: string): Promise<MatchState> {
        const [match] = await db
            .select()
            .from(matchesTable)
            .where(eq(matchesTable.matchId, matchId));

        if (!match) throw new Error("Game Not Found");
        return match as MatchState;
    }

    async makeMove(matchId: string, moveCoords: MoveCoords): Promise<MatchState> {
        const [match] = await db
            .select()
            .from(matchesTable)
            .where(eq(matchesTable.matchId, matchId));
        if (!match) throw new Error("Match not found");

        const newMatchState = move(match, moveCoords);

        await db.update(matchesTable)
            .set({
                game: newMatchState.game,
                xScore: newMatchState.xScore,
                oScore: newMatchState.oScore,
            })
            .where(eq(matchesTable.matchId, matchId));

        return newMatchState;
    }
}