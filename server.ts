import 'dotenv/config';
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { DbMatchApi } from './src/db/db.ts'

const app = express();
app.use(express.json());
const api = new DbMatchApi();

const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET","POST"]
    }
})

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

// create match
app.post('/api/match/', async (req, res) => {
    const match = await api.createMatch();
    res.json(match);
});

// make move (maybe a better route would be /api/game/.....)
app.post('/api/match/:matchId', async (req, res) => {
    const match = await api.makeMove(req.params.matchId, req.body);
    io.to(match.matchId).emit('matchUpdated', match)
    res.json(match);
});

//reset game (maybe should rename route api/game/.../reset)
app.post('/api/match/:matchId/reset/', async (req, res) => {
    const match = await api.resetGame(req.params.matchId);
    res.json(match);
});

httpServer.listen(3000, () => console.log("Server is listening on port 3000..."));
