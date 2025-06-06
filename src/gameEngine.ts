export type Player = "x" | "o";
export type Cell = Player | null;
export type Row = Cell[];
export type Board = Row[];
export type EndState = Player | "tie" | null;
export type GameState = {
    Board: Board;
    playerTurn: Player;
    EndState?: EndState;
};
export type MatchState = {
    game: GameState;
    xScore: number;
    oScore: number;
    matchId: string;
};
export type MoveCoords = {
    rowIndex: number;
    colIndex: number;
};

export function initMatchState(): MatchState {
    return {
        game: initGameState(),
        xScore: 0,
        oScore: 0,
        matchId: crypto.randomUUID(),
    };
}
export function initGameState(): GameState {
    return {
        Board: [
            [null, null, null],
            [null, null, null],
            [null, null, null],
        ],
        playerTurn: "x",
        EndState: null,
    };
}

export function move(prevState: MatchState, moveCoords: MoveCoords): MatchState {
    if (prevState.game.EndState !== null) return prevState;

    const newState = structuredClone(prevState);
    if (newState.game.Board[moveCoords.rowIndex][moveCoords.colIndex]) return newState;
    newState.game.Board[moveCoords.rowIndex][moveCoords.colIndex] = newState.game.playerTurn;
    newState.game.playerTurn = switchPlayer(newState.game.playerTurn);

    newState.game.EndState = checkEndState(newState.game);
    if (newState.game.EndState === "o") newState.oScore++;
    if (newState.game.EndState === "x") newState.xScore++;

    return newState;
}

function checkEndState(newState: GameState): EndState {
    let isTie: boolean = true;

    for (let i = 0; i < 3; i++) {
        // CHECK IF THERE ARE EMPTY SQUARE (IF SO IT ISN'T A TIE)
        for (let j = 0; j < 3; j++) {
            if (newState.Board[i][j] === null) isTie = false;
        }

        // CHECK ROWS AND COLUMNS FOR WINS
        if (
            newState.Board[i][0] === "o" &&
            newState.Board[i][1] === "o" &&
            newState.Board[i][2] === "o"
        ) {
            return "o";
        } else if (
            newState.Board[i][0] === "x" &&
            newState.Board[i][1] === "x" &&
            newState.Board[i][2] === "x"
        ) {
            return "x";
        } else if (
            newState.Board[0][i] === "o" &&
            newState.Board[1][i] === "o" &&
            newState.Board[2][i] === "o"
        ) {
            return "o";
        } else if (
            newState.Board[0][i] === "x" &&
            newState.Board[1][i] === "x" &&
            newState.Board[2][i] === "x"
        ) {
            return "x";
        }
    }

    // CHECK DIAGONALS FOR WIN
    if (
        newState.Board[0][0] === "o" &&
        newState.Board[1][1] === "o" &&
        newState.Board[2][2] === "o"
    ) {
        return "o";
    } else if (
        newState.Board[0][0] === "x" &&
        newState.Board[1][1] === "x" &&
        newState.Board[2][2] === "x"
    ) {
        return "x";
    }
    if (
        newState.Board[0][2] === "o" &&
        newState.Board[1][1] === "o" &&
        newState.Board[2][0] === "o"
    ) {
        return "o";
    } else if (
        newState.Board[0][2] === "x" &&
        newState.Board[1][1] === "x" &&
        newState.Board[2][0] === "x"
    ) {
        return "x";
    }

    if (isTie) return "tie";
    return null;
}

function switchPlayer(curPlayer: Player): Player {
    return curPlayer === "x" ? "o" : "x";
}
