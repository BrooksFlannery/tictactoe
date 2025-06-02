// import { useState } from 'react'

import { useState, useEffect } from 'react';
import { InitGameState, InitMatchState, move, type moveCoords } from './gameEngine'

function App() {
  const [matchState, setMatchState] = useState(InitMatchState());
  const [message,setMessage] = useState('');

  useEffect(()=> {
    checkMessage();
    if(matchState.game.endstate !== null){
      resetGameState();
    }
  }, [matchState])  

  function resetGameState(){
   setTimeout(()=> {
        setMatchState({...matchState, game: InitGameState()})
        setMessage('')
    },2000)
}

  function checkMessage(){
      {switch(matchState.game.endstate){
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
    const coords : moveCoords = {
      rowIndex, colIndex:cellIndex
    };
    setMatchState(move(matchState,coords))
  }

  return (
    <>
    <h1>Tic-Tac-Toe</h1>
      <div className='board'>
        {matchState.game.board.map((row, rowIndex) => {
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

    </>

  )
}

export default App
