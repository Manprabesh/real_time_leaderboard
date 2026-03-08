import { Router } from 'express';
import { realTimeLeaderboard, getHighScore } from '../controllers/leaderboard.controller.js';
import authenticate from "../middlewares/auth.js"
const leaderboardRouter = Router();

leaderboardRouter.get("/leaderboard/:gameId",authenticate,realTimeLeaderboard);
leaderboardRouter.get("/score/:gameId",authenticate,getHighScore);
export default leaderboardRouter;
