import { dbConfig } from "../configs/database.js";
const client = await dbConfig()

// import dbClient from "../server.js";
// console.log("dbclient",dbClient)
// console.log(x)
export const gameTable = async (db) => {
    // console.log("db clie",dbCli)
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS games(
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID NOT NULL,
            game_name VARCHAR(150) NOT NULL UNIQUE,

            CONSTRAINT fk_game_user
                FOREIGN KEY (user_id)
                REFERENCES users(id)
                ON DELETE CASCADE,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                 
         )`
        await db.query(query);
        console.log("✅ game table created");
    } catch (error) {
        console.error("errro while creating game table",error)

    }
}