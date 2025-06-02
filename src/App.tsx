// import { useState } from 'react'

import { useState } from 'react';
import './App.css'
import { InitGameState, move, type moveCoords } from './gameEngine'

function App() {

  const [gameState, setGameState] = useState(InitGameState())

  function handleClick(cellIndex:number, rowIndex:number){
    const coords : moveCoords = {
      rowIndex, colIndex:cellIndex
    };
    setGameState(move(gameState, coords))
  }

  return (
    <div className='board'>
      {gameState.board.map((row, rowIndex) => {
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
  )
}

export default App
