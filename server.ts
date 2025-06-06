import 'dotenv/config';
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from 'cors';
import { DbMatchApi } from './src/db/db.ts';

const allowedOrigins = ['http://localhost:5173', 'https://tictactoe-ux6o.onrender.com'];

const app = express();
app.use(express.json());
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

const api = new DbMatchApi();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST']
  }
});

io.on("connection", (socket)=>{
    socket.on("joinMatch", (match) => {
        socket.join(match.matchId);
        console.log(`${socket.id} joined match ${match.matchId}`);
    })
})

// get match
app.get('/api/match/:matchId/', async (req, res) => {
    const match = await api.getMatch(req.params.matchId);
    res.json(match);
});

//get matches
app.get('/api/matches/', async (req, res) => {
    const matches = await api.getMatches();
    res.json(matches);
})


// make move (maybe a better route would be /api/game/.....)
app.post('/api/match/:matchId', async (req, res) => {
    const match = await api.makeMove(req.params.matchId, req.body);
    io.to(match.matchId).emit('matchUpdated', match)
    res.json(match);
});

//reset game (maybe should rename route api/game/.../reset)
app.post('/api/match/:matchId/reset/', async (req, res) => {
    const match = await api.resetGame(req.params.matchId);
    io.to(match.matchId).emit('matchUpdated', match)
    res.json(match);
});

app.post('/api/match/:matchId/rename/', async (req,res) => {
    const match = await api.renameMatch(req.params.matchId, req.body.newName);
    io.to(match.matchId).emit('matchUpdated', match)
    res.json(match);
})

// create match
app.post('/api/match/', async (req, res) => {
    const match = await api.createMatch();
    res.json(match);
});

const PORT = 3000;
httpServer.listen(3000, () => console.log(`Server is listening on http://localhost:${PORT}`))
