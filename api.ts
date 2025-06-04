import { error } from 'console';
import { InitGameState, InitMatchState, move, type MatchState, type MoveCoords } from './src/gameEngine'

export interface MatchAPI {
    makeMove(matchId : string, moveCoords : MoveCoords): Promise<MatchState>
    createMatch() : Promise<MatchState>
    getMatch(matchId : string) : Promise<MatchState>
} 

function findMatch(matchId:string) : MatchState{
    const matchState = this.matches.get(matchId);
        if(!matchState) throw error('No Match Found');
        return matchState;
}
export class MemoryMatchAPI implements MatchAPI {
    private matches: Map<string, MatchState> = new Map();

    async createMatch() : Promise<MatchState>{
        const match = InitMatchState();
        this.matches.set(match.matchId, match)
        return match;
    }
    async getMatch(matchId: string): Promise<MatchState> {
        return findMatch(matchId);
    }
    async makeMove(matchId: string, moveCoords: MoveCoords): Promise<MatchState> {
        const matchState = findMatch(matchId);
        const newMatchState = move(matchState, moveCoords)
        return newMatchState;
    }
}