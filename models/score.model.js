import { dbConfig } from "../configs/database.js";
const client = await dbConfig()

export const scoreTable = async (db) => {
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS scores(
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID NOT NULL,
            game_id UUID NOT NULL,
            current_score INTEGER NOT NULL CHECK (score >= 0),
            best_score INTEGER NOT NULL CHECK (score >= 0),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            CONSTRAINT fk_score_user
                FOREIGN KEY (user_id)
                REFERENCES users(id)
                ON DELETE CASCADE,

            CONSTRAINT fk_score_game
                FOREIGN KEY (game_id)
                REFERENCES games(id)
                ON DELETE CASCADE,

            CONSTRAINT unique_user_game UNIQUE (user_id, game_id)
            )`
        await db.query(query);
        console.log("✅ score table created");
    } catch (error) {
        console.error("errro while creating score table", error)

    }
}