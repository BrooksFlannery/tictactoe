import { ClientMatchAPI } from "../api.ts"
import { useLoaderData, useNavigate } from "react-router";
import type { MatchState } from "../gameEngine.ts";
import { playRandomSound } from '../utils/soundPlayer.ts'

export function loadLobby(){
    const api = new ClientMatchAPI
    return api.getMatches();
}

function MatchDisplay(match:MatchState){
    const navigate = useNavigate();
    const handleClick = () => {
        playRandomSound.interaction();
        navigate(`/matchView/${match.matchId}`);
    }

    return(
        <div className="lobby-match" key={match.matchId} onClick={handleClick}>
            {match.matchId}
        </div>
    )
}

export function LobbyView(){
    const matches: MatchState[] = useLoaderData();
    return(
        <div className="lobby-match-container">
            {matches.map((match) => MatchDisplay(match))}
        </div>
    )
}