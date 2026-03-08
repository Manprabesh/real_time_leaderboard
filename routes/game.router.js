import { Router } from 'express';
import { uploadGame, getGames, searchGame, updateGame} from '../controllers/game.controller.js';
import authenticate from "../middlewares/auth.js"
const gameRouter = Router();

gameRouter.post("/submit-game",authenticate,uploadGame);
gameRouter.get("/get-game",authenticate,getGames);
gameRouter.get("/search-game",authenticate,searchGame);
gameRouter.put("/update-game",authenticate,updateGame)

export default gameRouter;