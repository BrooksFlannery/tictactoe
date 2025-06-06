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
    const handleMatchClick = () => {
        playRandomSound.interaction();
        navigate(`/matchView/${match.matchId}`);
    }

    return(
        <div title='Join Match'className="lobby-match" key={match.matchId} onClick={handleMatchClick}>
            {match.matchName}
        </div>
    )
}

export function LobbyView(){
    const matches: MatchState[] = useLoaderData();
    const navigate = useNavigate();

    const handleCreateClick = async() => {
        const api = new ClientMatchAPI
        const match = await api.createMatch();
        console.log('')
        playRandomSound.interaction();
        navigate(`/matchView/${match.matchId}`);
    }

    return(
        <div className="lobby-screen">
                <button title="Create Match" className = 'create-match' onClick={handleCreateClick}>
                    Create Match
                </button>
            <div className="lobby-match-container">
                {matches.map((match) => MatchDisplay(match))}
            </div>
        </div>
    )
}