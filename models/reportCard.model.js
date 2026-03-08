import { dbConfig } from "../configs/database.js";
const client = await dbConfig()

export const reportCardTable = async (db) => {
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS reportCard(
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID NOT NULL UNIQUE,
            total_time_spent INTEGER NOT NULL DEFAULT 0,
            best_game_id UUID,
            best_score INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            CONSTRAINT fk_report_user
                FOREIGN KEY (user_id)
                REFERENCES users(id)
                ON DELETE CASCADE,

            CONSTRAINT fk_best_game
                FOREIGN KEY (best_game_id)
                REFERENCES games(id)
                ON DELETE SET NULL
            )`
        await db.query(query);
        console.log("✅ report card table created");
    } catch (error) {
        console.error("errro while creating report table", error)

    }
}