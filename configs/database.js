import { Pool } from "pg"
let pool;
export const dbConfig = async () => {
    try {


        pool = new Pool(
            {
                host: process.env.DATABASE_HOST,
                user: process.env.DATABASE_USER,
                database: process.env.DATABASE_NAME,
                max: 20,
                password: process.env.DATABASE_PASSWORD,
                port: process.env.DATABASE_PORT,
                idleTimeoutMillis: 30000,
                connectionTimeoutMillis: 2000,
                maxLifetimeSeconds: 60,
            }
        )

        return pool;
    } catch (error) {
        console.error("Error while connecting to database", error)
    }
}