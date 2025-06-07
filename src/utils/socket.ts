import { io } from "socket.io-client";

// const URL = 'https://tictactoe-ux6o.onrender.com'//lazy and bad
const URL = "http://localhost:3000"

export const socket = io(`${URL}`);