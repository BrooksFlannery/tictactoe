export type endstate = player | null;
export type player = "x" | "o";
export type cell = player | null;
export type gameState = {
    board: cell[][],
    playerTurn: player,
    endstate?: endstate
}
export type moveCoords = {
    rowIndex : number,
    colIndex: number
}
export function InitGameState(){
    return {
        board: [[null, null, null],[null, null, null],[null, null, null]],
        playerTurn: "x",
    }
}

export function move(prevState:gameState, moveCoords: moveCoords) : gameState{
    const newState = structuredClone(prevState);
    if(newState.board[moveCoords.rowIndex][moveCoords.colIndex]) return newState;
    newState.board[moveCoords.rowIndex][moveCoords.colIndex] = newState.playerTurn;
    newState.playerTurn = switchPlayer(newState.playerTurn)
    return newState;
}

export function switchPlayer(curPlayer:player):player{
    return curPlayer === "x" ? "o" : "x";  
}