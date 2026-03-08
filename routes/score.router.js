import { Router } from 'express';
import { scoreSubmission } from '../controllers/score.controller.js';
import authenticate from "../middlewares/auth.js"
const scoreRouter = Router();

scoreRouter.post("/submit-score",authenticate,scoreSubmission);
export default scoreRouter;
