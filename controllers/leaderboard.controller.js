import configRedis from "../configs/redis.config.js";
import { redisClient } from "../server.js";
import { db } from "../server.js";
import { GET_USER_SCORE_GAME } from "../db/query.js";

export const realTimeLeaderboard = async (req, res) => {
    try {
        const { userId } = req;
        const gameId = req.params.gameId;
        const client = redisClient;

        //SSE headers
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const interval = setInterval(async () => {

            const range = await client.zRange(
                gameId,
                0,
                50,
                { REV: true }
            );

            let scoreData = [];

            for (let i = 0; i < range.length; i++) {

                const score = await db.query(
                    GET_USER_SCORE_GAME,
                    [range[i], gameId]
                );

                scoreData[i] = score.rows[0];
            }

            // Send SSE event
            res.write(`data: ${JSON.stringify(scoreData)}\n\n`);

        }, 10000); // update every 2 seconds

        req.on("close", () => {
            console.log("SSE client disconnected");
            clearInterval(interval);
        });

    } catch (error) {
        console.log("error", error);
        return res.status(501).json({ message: "Internal Server error" });
    }
}

export const getHighScore = async (req, res) => {
    try {
        const { userId } = req;
        const gameId = req.params.gameId;
        const client = redisClient;
        const range = await client.zRange(
            gameId,
            0,
            1,
            {
                REV: true
            }
        );

        console.log("range", range);
        let scoreData = [];


        for (let i = 0; i < range.length; i++) {
            console.log("id", range[i])
            const score = await db.query(GET_USER_SCORE_GAME, [range[i], gameId]);
            console.log("all user", score.rows);
            scoreData[i] = score.rows;
        }

        return res.status(200).json({ data: scoreData });
    } catch (error) {
        console.log("error", error);

        return res.status(501).json({ message: "Internal Server error" });
    }
}

