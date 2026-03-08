import { GET_GAME_BY_USERID, CREATE_GAME } from "../db/query.js"
import { db } from "../server.js";

export const uploadGame = async (req, res) => {
    try {
        const { game } = req.body;
        const { userId } = req;

        const result = await db.query(GET_GAME_BY_USERID, [game]);
        console.log(result.rows.length);
        console.log(result.rows.length);


        if (!result.rows.length) {
            console.log("do not exist")
            const result = await db.query(CREATE_GAME, [userId, game])
            console.log("game created", result.rows);
            return res.status(201).json({ message: "game created", data: result.rows[0] })
        }

        return res.status(200).json({ message: "game already exist", data: result.rows[0] });


    } catch (error) {
        console.log("error", error);
        return res.status(501).json({ message: "Internal server error" });

    }
}

//get games
export const getGames = async (req, res) => {
    try {
        const query = "SELECT id,game_name FROM games";
        const { rows } = await db.query(query);
        console.log("rows", rows);
        return res.status(200).json({ data: rows })
    } catch (error) {
        console.log("error", error);
        return res.status(501).json({ message: "Internal server error" });
    }
}


//search games
export const searchGame = async (req, res) => {
    try {
        const { game_name } = req.params;
        const query = "SELECT id, game_name FROM games where game_name ILIKE  $1";

        const { rows } = await db.query(query, [game_name]);
        return res.status(200).json({ data: rows })

    } catch (error) {
        console.log("error", error);
        return res.status(501).json({ message: "Internal server error" });
    }
}

//update user games 
export const updateGame = async (req, res) => {
    try {

        const {gameId,game_name} = req.body;
        const query = ` UPDATE games
        SET game_name = $1
        WHERE id $2;`

        const result = await db.query(query,[gameId,game_name]);

        console.log("results",result);

        return res.status(200).json({message:"updated successfull"});

    } catch (error) {
        console.log("error", error);
        return res.status(501).json({ message: "Internal server error" });
    }
}

//delete user games 
export const deleteGame = async (req, res) => {
  try {
    const { gameId } = req.params;

    const query = `
      DELETE FROM games
      WHERE id = $1
      RETURNING *
    `;

    const result = await db.query(query, [gameId]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Game not found"
      });
    }

    return res.status(200).json({
      message: "Game deleted successfully",
      game: result.rows[0]
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};
