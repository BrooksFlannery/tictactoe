import 'dotenv/config'; 
import express from "express";
import ViteExpress from "vite-express";
import { DbMatchApi } from './src/db/db.ts'

const app = express();
app.use(express.json());
const api = new DbMatchApi();

// get match
app.get('/api/match/:matchId', async (req, res) => {
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
    res.json(match);
});

//reset game (maybe should rename route api/game/.../reset)
app.post('/api/match/:matchId/reset', async (req, res) => {
    const match = await api.resetGame(req.params.matchId);
    res.json(match);
});

ViteExpress.listen(app, 3000, () => console.log("Server is listening on port 3000..."));