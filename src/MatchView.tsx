import { useState, useEffect, useMemo } from 'react';
import type { MatchState, MoveCoords } from './gameEngine.ts';
import { ClientMatchAPI } from './api.ts';
import { useParams } from 'react-router';

function MatchView(){
  const api = useMemo(() => new ClientMatchAPI(), []);
  const unsafeMatchId  = useParams().matchId;
  if(!unsafeMatchId) throw new Error('No matchId')
  const matchId = unsafeMatchId;

  const [matchState, setMatchState] = useState<MatchState | undefined>(undefined);
  const [winMessage, setWinMessage] = useState('');
  const [shake, setShake] = useState(false);

  useEffect(() => {
    async function init() {
      const match = await api.getMatch(matchId)
      setMatchState(match);
    }
    init();
    }, [api]);

  useEffect(() => {
    if (!matchState || !matchState.game) return;

    async function handleWin(endState: "x" | "o" | "tie", currentMatchId: string) {
      const randomSound =
        endState === "tie"
          ? failSounds[Math.floor(Math.random() * failSounds.length)]
          : successSounds[Math.floor(Math.random() * successSounds.length)];
      const sound = new Audio(randomSound);
      sound.playbackRate = 0.8 + (Math.random() - 0.1);
      sound.play();

      setWinMessage(
        endState === "tie"
          ? "Tie..."
          : endState === "x"
          ? "X's Win!!!"
          : "O's Win!!!"
      );

      const matchIdToReset = currentMatchId;
      setTimeout(async () => {
        const resetMatch = await api.resetGame(matchIdToReset);
        setMatchState(resetMatch);
        setWinMessage('');
      }, 2000);
    }

    const { EndState } = matchState.game;
    if (EndState === "x" || EndState === "o" || EndState === "tie") {
      handleWin(EndState as "x" | "o" | "tie", matchState.matchId);
    }
  }, [matchState, api]);

  useEffect(() => {
    if (shake) {
      const timeout = setTimeout(() => setShake(false), 400);
      return () => clearTimeout(timeout);
    }
  }, [shake]);

  if (!matchState || !matchState.game) {
    return 'loading...';
  }

  const successSounds = [
    '../sounds/success/1.mp3',
    '../sounds/success/2.mp3',
    '../sounds/success/3.mp3',
    '../sounds/success/4.mp3',
    '../sounds/success/5.mp3',
  ];
  const failSounds = [
    '../sounds/failure/1.mp3',
    '../sounds/failure/2.mp3',
    '../sounds/failure/3.mp3',
  ];

  async function handleMove(matchId: string, coords: MoveCoords) {
    const match = await api.makeMove(matchId, coords);
    setMatchState(match);
  }

  function handleClick(cellIndex: number, rowIndex: number) {
    if (!matchState) return;
    setShake(true);
    const sound = new Audio('../sounds/toyEdit1.mp3');
    sound.playbackRate = 0.8 + (Math.random() - 0.1);
    sound.play();
    const coords: MoveCoords = {
      rowIndex,
      colIndex: cellIndex,
    };
    handleMove(matchState.matchId, coords);
  }

  return (
    <div className='game-screen'>
      <div
        className={`board ${
          shake ? ['shake', 'rattle', 'roll'][Math.floor(Math.random() * 3)] : ''
        }`}
      >
        {matchState.game.Board.map((row, rowIndex) => {
          return (
            <div key={rowIndex} className='row'>
              {row.map((cell, cellIndex) => {
                return (
                  <div
                    onClick={() => handleClick(cellIndex, rowIndex)}
                    className='cell'
                    key={cellIndex}
                  >
                    {cell}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <div className='score-board'>
        <div className='score o'>O: {matchState.oScore}</div>
        <div className='score x'>X: {matchState.xScore}</div>
      </div>
      <div className='end-state'>{winMessage}</div>
    </div>
  );
}

export default MatchView
