import { io } from "socket.io-client";


const URL = 'https://tictactoe-ux6o.onrender.com'//lazy and bad

export const socket = io(`${URL}`);