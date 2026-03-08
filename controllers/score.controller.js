import { db } from "../server.js";
import {  UPDATE_SCORE } from "../db/query.js";
import { redisClient } from "../server.js";
export const scoreSubmission = async (req, res) => {
    try {
        const { gameId, score } = req.body;
        const { userId } = req

        const result = await db.query(UPDATE_SCORE, [userId, gameId, score]);
        
        console.log("results",result.rows);
        
        //set to redis
        const  client =  redisClient;
        const response = await client.zAdd(gameId,{score:score,value:userId});
        console.log("save to reddis",response);

        return res.status(200).json({
            message: "Score updated",
            data: result.rows[0]
        });


    } catch (error) {
        console.log('error', error)
        res.status(501).json({ error: error });
    }
}