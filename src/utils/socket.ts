import { io } from "socket.io-client";

const URL = 'https://tictactoe-ux6o.onrender.com'//lazy and bad
const DEV_URL = 'http://localhost:3000/'

export const socket = io(`${DEV_URL}`, { autoConnect: false });
