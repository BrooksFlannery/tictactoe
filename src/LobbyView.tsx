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
        console.log('click')
        navigate(`/matchView/${match.matchId}`);
    }

    return(
        <div key={match.matchId}onClick={handleClick}>
            {match.matchId}
        </div>
    )
}

export function LobbyView(){
    const matches: MatchState[] = useLoaderData();
    return(
        <div>
            {matches.map((match) => MatchDisplay(match))}
        </div>
    )
}