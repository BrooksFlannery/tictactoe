import { initMatchState, initGameState, move, type MatchState, type MoveCoords } from './gameEngine.ts';


const URL = 'https://tictactoe-ux6o.onrender.com'


export interface MatchAPI {
    makeMove(matchId: string, moveCoords: MoveCoords): Promise<MatchState>;
    createMatch(): Promise<MatchState>;
    getMatch(matchId: string): Promise<MatchState>;
    resetGame(matchId: string): Promise<MatchState>;
    getMatches(): Promise<MatchState[]>;
    renameMatch(matchId: string, newName: string): Promise<MatchState> 
}

function findMatch(matchId: string, matches: Map<string, MatchState>): MatchState {
    const matchState = matches.get(matchId);
    if (!matchState) throw new Error('No Match Found');
    return matchState;
}

export class MemoryMatchAPI implements MatchAPI {
    private matches: Map<string, MatchState> = new Map();

    async makeMove(matchId: string, moveCoords: MoveCoords): Promise<MatchState> {
        const matchState = findMatch(matchId, this.matches);
        const newMatchState = move(matchState, moveCoords);
        this.matches.set(matchId, newMatchState);
        return newMatchState;
    }

    async createMatch(): Promise<MatchState> {
        const match = initMatchState();
        this.matches.set(match.matchId, match);
        return match;
    }
    async renameMatch(matchId: string, newName: string): Promise<MatchState> {
        const matchState = findMatch(matchId, this.matches);
        const newMatchState = {...matchState, matchName: newName};
        return newMatchState;
    }
    
    async getMatch(matchId: string): Promise<MatchState> {
        return findMatch(matchId, this.matches);
    }

    async getMatches(): Promise<MatchState[]> {
        const matchesArr = Array.from(this.matches.values())
        return matchesArr;
    }//untested i think it should work though???

    async resetGame(matchId: string): Promise<MatchState> {
        const matchState = findMatch(matchId, this.matches);
        matchState.game = initGameState();
        return matchState;
    }
}

export class ClientMatchAPI implements MatchAPI {
    async makeMove(matchId: string, moveCoords: MoveCoords): Promise<MatchState> {
        const response = await fetch(`${URL}/api/match/${matchId}/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(moveCoords),
        });
        const match = await response.json();
        return match;
    }

    async createMatch(): Promise<MatchState> {
        const response = await fetch(`${URL}/api/match/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });
        const match = await response.json();
        return match;
    }

    async renameMatch(matchId: string, newName: string): Promise<MatchState> {
        console.log("new name: ", newName, " matchId: ", matchId)
        const response = await fetch(`${URL}/api/match/${matchId}/rename/` , {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({newName})
        });
        const match = await response.json();
        return match;
    }

    async getMatch(matchId: string): Promise<MatchState> {
        const response = await fetch(`${URL}/api/match/${matchId}/`, {
            method: "GET",
        });
        const match = await response.json();
        return match;
    }

    async getMatches(): Promise<MatchState[]> {
        const response = await fetch(`${URL}/api/matches/`, {
            method : "GET",
        });
        const matches = await response.json();
        return matches
    }

    async resetGame(matchId: string): Promise<MatchState> {
        const response = await fetch(`${URL}/api/match/${matchId}/reset/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });
        const match = await response.json();
        return match;
    }
}
