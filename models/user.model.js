import { dbConfig } from "../configs/database.js";
const client = await dbConfig()

export const userTable = async (db) => {
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS users(
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            email VARCHAR(100) NOT NULL,
            password TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),         
            updated_at TIMESTAMP DEFAULT NOW()         
         )`
        await db.query(query);
        console.log("✅ user table created");
    } catch (error) {
        console.error("errro while creating user table",error)
    }
}