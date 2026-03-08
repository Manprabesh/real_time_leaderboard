import express from 'express';
const app = express();

import cors from 'cors';
import 'dotenv/config'
import rateLimit from "express-rate-limit";
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 100,            // limit each IP to 100 requests per window
  message: {
    status: 429,
    error: "Too many requests, please try again later"
  },
  standardHeaders: true,
  legacyHeaders: false
});

//rate limitter
app.use(limiter);


// Middleware
app.use(cors());
app.use(express.json());

import configRedis from './configs/redis.config.js';
export let redisClient = await configRedis();
import { dbConfig } from './configs/database.js';
export let db = await dbConfig();
// export  dbClient;
// console.log("dbclient",dbClient)

//import tables
import { userTable } from './models/user.model.js';
import { scoreTable } from './models/score.model.js';
import { gameTable } from './models/game.model.js';
import { reportCardTable } from './models/reportCard.model.js';


//import all the routes
import router from './routes/auth.router.js';
app.use(router);
import scoreRouter from "./routes/score.router.js"
app.use(scoreRouter);
import gameRouter from './routes/game.router.js';
app.use(gameRouter);
import leaderboardRouter from './routes/leaderboard.router.js';
app.use(leaderboardRouter);
app.listen(5000, async () => {
    // dbClient = 

    // console.log(client)
    db.connect((err, client) => {
        if (err) {

            console.log("Error while connecting database", err)
        }
        else {
            console.log("successfull connected to", process.env.DATABASE_NAME, " database")
            userTable(db);
            gameTable(db);
            scoreTable(db);
            reportCardTable(db);
            // console.log("successfull connected to",client)
        }
    })
    console.log("app is running on port 5000")
})

