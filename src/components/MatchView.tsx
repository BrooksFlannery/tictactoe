import { useState, useEffect, useMemo } from 'react';
import type { MatchState, MoveCoords } from '../gameEngine.ts';
import { ClientMatchAPI } from '../api.ts';
import { useLoaderData, type LoaderFunctionArgs } from 'react-router';
import { socket } from '../utils/socket.ts';
import { playRandomSound } from '../utils/soundPlayer.ts';

export async function loadMatch({ params }: LoaderFunctionArgs): Promise<MatchState> {
  const matchId = params.matchId as string;
  const api = new ClientMatchAPI();
  const match = await api.getMatch(matchId);
  return match;
}

export function MatchView() {
  const api = useMemo(() => new ClientMatchAPI(), []);
  const match: MatchState = useLoaderData();
  const [matchState, setMatchState] = useState<MatchState>(match);
  const [winMessage, setWinMessage] = useState('');
  const [title, setTitle] = useState(match.matchName);
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
      socket.connect(); 
    socket.on('matchUpdated', (updatedMatch) => {
      setShake(true);
      setMatchState(updatedMatch);
    });
  }, []);

  useEffect(() => {
    if (!match.matchId) return;
    socket.emit('joinMatch', match);

    return () => {
      socket.off('connect');
      socket.off('matchUpdated');
    };
  }, [match.matchId]);

  useEffect(() => {
    if (!matchState || !matchState.game) return;

    const { EndState } = matchState.game;
    if (EndState === 'x' || EndState === 'o' || EndState === 'tie') {
      EndState === 'tie'
        ? playRandomSound.failure()
        : playRandomSound.success();

      setWinMessage(
        EndState === 'tie'
          ? 'Tie...'
          : EndState === 'x'
          ? "X's Win!!!"
          : "O's Win!!!"
      );
    }
  }, [matchState]);

  useEffect(() => {
    if (shake) {
      const timeout = setTimeout(() => setShake(false), 400);
      return () => clearTimeout(timeout);
    }
  }, [shake]);

  if (!matchState || !matchState.game) {
    return 'loading...';
  }

  async function handleMove(matchId: string, coords: MoveCoords) {
    const match = await api.makeMove(matchId, coords);
    setMatchState(match);
  }

  async function handleClick(cellIndex: number, rowIndex: number) {
    if (!matchState) return;
    playRandomSound.interaction();

    const { EndState } = matchState.game;
    if (EndState === 'x' || EndState === 'o' || EndState === 'tie') {
      const resetMatch = await api.resetGame(matchState.matchId);
      setMatchState(resetMatch);
      setWinMessage('');
      return;
    }

    const coords: MoveCoords = {
      rowIndex,
      colIndex: cellIndex,
    };
    handleMove(matchState.matchId, coords);
  }

const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    api.renameMatch(match.matchId, title)
    setIsEditingName(false);
  }

    return (
    <div className='game-screen'>
      {!isEditingName && (
        <div title='Edit Name'onClick={() => setIsEditingName(true)} className='lobby-match'>
          {title}
        </div>
      )}

      {isEditingName && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
          <button type='submit'>Submit</button>
        </form>
      )}

      <div className='score-and-board'>
        <div className='score o'>O: {matchState.oScore}</div>
        <div
          className={`board ${
            shake ? ['shake', 'rattle', 'roll'][Math.floor(Math.random() * 3)] : ''
          }`}
        >
          {matchState.game.Board.map((row, rowIndex) => (
            <div key={rowIndex} className='row'>
              {row.map((cell, cellIndex) => (
                <div
                  onClick={() => handleClick(cellIndex, rowIndex)}
                  className='cell'
                  key={cellIndex}
                >
                  {cell}
                </div>
              ))}
            </div>
          ))}
        </div>
          <div className='score x'>X: {matchState.xScore}</div>
        </div>
      <div className='end-state'>{winMessage}</div>
    </div>
  );

}
