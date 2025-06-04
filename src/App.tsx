// import { useState } from 'react'

import { useState, useEffect } from 'react';
import { InitGameState, InitMatchState, move, type MoveCoords } from './gameEngine'

function App() {
  const [matchState, setMatchState] = useState(InitMatchState());
  const [message,setMessage] = useState('');
  const [shake, setShake] = useState(false);

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
    ]

  useEffect(()=> {
    checkMessage();
    
    if(matchState.game.EndState === "x" || matchState.game.EndState === "o"){
      
      const randomSound = successSounds[Math.floor(Math.random() * successSounds.length)];

      const sound = new Audio(randomSound);
      sound.playbackRate = .8+( Math.random() - .1);
      sound.play();
      resetGameState();
    }
    if(matchState.game.EndState === 'tie'){
      const randomSound = failSounds[Math.floor(Math.random() * failSounds.length)];

      const sound = new Audio(randomSound);
      sound.playbackRate = .8+( Math.random() - .1);
      sound.play();
      resetGameState();
    }
  }, [matchState])  

  function resetGameState(){
   setTimeout(()=> {
      setMessage('')
      setMatchState({...matchState, game: InitGameState()})
    },2000)
}

  function checkMessage(){
      {switch(matchState.game.EndState){
        case "x":
         setMessage("X's Win!!!")
        break;
        case "o":
          setMessage("O's Win!!!")
          break;
        case "tie":
          setMessage('Tie...')
          break;
        default:
          break;
      }}
  }

  function handleClick(cellIndex:number, rowIndex:number){
    setShake(true)
    const sound = new Audio('../sounds/toyEdit1.mp3');
    sound.playbackRate = .8+( Math.random() - .1);
    sound.play();
    const coords : MoveCoords = {
      rowIndex, colIndex:cellIndex
    };
    setMatchState(move(matchState,coords))
  }

   useEffect(() => {
    if (shake) {
      const timeout = setTimeout(() => setShake(false), 400);
      return () => clearTimeout(timeout);
    }
  }, [shake]);

  return (
    <div className='game-screen'>
      <h1>Tic-Tac-Toe</h1>
        <div className={`board ${shake ? ['shake', 'rattle', 'roll'][Math.floor(Math.random() * 3)] : ''}`}>
          {matchState.game.Board.map((row, rowIndex) => {
            return ( 
              <div key = {rowIndex} className='row'> 
                {row.map((cell, cellIndex) => {
                  return (
                  <div onClick={()=>handleClick(cellIndex, rowIndex)} className = "cell" key={cellIndex}> 
                    {cell} 
                  </div>)
                })
              }
              </div>)
            })}
        </div>
      <div className='score-board'>
          <div className='score o'>O: {matchState.oScore}</div>
          <div className='score x'>X: {matchState.xScore}</div>
      </div>    
      <div className='end-state'>
            {message}
      </div>
    </div>

  )
}

export default App
