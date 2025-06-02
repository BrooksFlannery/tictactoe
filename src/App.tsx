// import { useState } from 'react'

import './App.css'
import { InitGameState } from './gameEngine'

function App() {

  const gameState = InitGameState();
  return (
    <>
      {JSON.stringify(gameState)}
    </>
  )
}

export default App
