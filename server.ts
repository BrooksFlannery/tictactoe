import express from "express";
import ViteExpress from "vite-express";
import { MemoryMatchAPI } from "./api";

const app = express();
app.use(express.json());
const api = new MemoryMatchAPI();


//get game
app.get('/api/match/:matchId', async (req,res) => {
    const match = api.getMatch(req.params.matchId);
    res.json(match)
})

//create game
app.post('/api/match/', async (req,res) =>{
    const match = api.createMatch();
    res.json(match);
})

//make move
app.post('/api/match/:matchId', async (req,res) => {
    const match = api.makeMove(req.params.matchId, req.body.moveCoords);
    res.json(match);
})


ViteExpress.listen(app, 3000, () => console.log("Server is listening on port 3000..."));