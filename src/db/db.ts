import { drizzle } from 'drizzle-orm/postgres-js';
import type { MatchAPI } from "../api.ts";
import { initGameState, initMatchState, type MatchState, type MoveCoords, move } from "../gameEngine.ts";
import { matchesTable } from "./schema.ts";
import { eq } from "drizzle-orm";

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable isnt set');
}
export const db = drizzle(process.env.DATABASE_URL)

export class DbMatchApi implements MatchAPI {
    async resetGame(matchId: string): Promise<MatchState> {
        const [match] = await db
            .select()
            .from(matchesTable)
            .where(eq(matchesTable.matchId, matchId));
        if (!match) throw new Error("Game not found");

        const newMatch = {
            ...match,
            game: initGameState(),
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
        const match = initMatchState();

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

    async getMatches(): Promise<MatchState[]>{
        const matches = await db
            .select()
            .from(matchesTable)//maybe later limit to something more specific or quantity
        
        if(!matches) throw new Error("No Games Found");
        return matches as MatchState[];
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