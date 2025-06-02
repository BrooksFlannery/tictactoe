export type player = "x" | "o";
export type cell = player | null;
export type row = cell[]
export type board = row[]
export type endstate = player | "tie" | null;
export type gameState = {
    board: board,
    playerTurn: player,
    endstate?: endstate
}
export type matchState = {
    game:gameState,
    xScore : number,
    oScore : number
}
export type moveCoords = {
    rowIndex : number,
    colIndex: number
}

export function InitMatchState(): matchState{
    return{
        game: InitGameState(),
        xScore :0,
        oScore :0
    }
}
export function InitGameState(): gameState{
    return {
        board: [[null, null, null],[null, null, null],[null, null, null]],
        playerTurn: "x",
        endstate:null
    }
}

export function move(prevState:matchState, moveCoords: moveCoords) : matchState{
    if(prevState.game.endstate !== null) return prevState;

    const newState = structuredClone(prevState);
    if(newState.game.board[moveCoords.rowIndex][moveCoords.colIndex]) return newState;
    newState.game.board[moveCoords.rowIndex][moveCoords.colIndex] = newState.game.playerTurn;
    newState.game.playerTurn = switchPlayer(newState.game.playerTurn)

    newState.game.endstate = checkEndState(newState.game);
    if(newState.game.endstate === 'o') newState.oScore++;
    if(newState.game.endstate === 'x') newState.xScore++;



    return newState;
}

function checkEndState(newState:gameState):endstate{
    let isTie:boolean = true

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if(newState.board[i][j] === null) isTie = false;
        }

        if(newState.board[i][0] === "o" 
            && newState.board[i][1] === "o" 
            && newState.board[i][2] === "o"){
            return "o";
        }else if(newState.board[i][0] === "x" 
            && newState.board[i][1] === "x" 
            && newState.board[i][2] === "x"){
            return "x";
        }
        else if(newState.board[0][i] === "o" 
            && newState.board[1][i] === "o" 
            && newState.board[2][i] === "o"){
            return "o";
        }else if(newState.board[0][i] === "x" 
            && newState.board[1][i] === "x" 
            && newState.board[2][i] === "x"){
            return "x";
        }
    }

    if(newState.board[0][0] === "o" 
        && newState.board[1][1] === "o" 
        && newState.board[2][2] === "o"){
            return "o";
    }else if(newState.board[0][0] === "x" 
        && newState.board[1][1] === "x" 
        && newState.board[2][2] === "x"){
            return "x";
        }
     if(newState.board[0][2] === "o" 
        && newState.board[1][1] === "o" 
        && newState.board[2][0] === "o"){
            return "o";
    }else if(newState.board[0][2] === "x" 
        && newState.board[1][1] === "x" 
        && newState.board[2][0] === "x"){
            return "x";
        }

        
    if(isTie) return "tie";



    return null;
}



function switchPlayer(curPlayer:player):player{
    return curPlayer === "x" ? "o" : "x";  
}