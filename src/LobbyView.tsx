import { ClientMatchAPI } from "./api"
import { useLoaderData, useNavigate } from "react-router";
import type { MatchState } from "./gameEngine";

export function loadLobby(){
    const api = new ClientMatchAPI
    return api.getMatches();
}

function MatchDisplay(match:MatchState){
    const navigate = useNavigate();
    const handleClick = () => {
        const sound = new Audio('../sounds/shake1.mp3');
        sound.playbackRate = 0.8 + (Math.random() - 0.1);
        sound.play();
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