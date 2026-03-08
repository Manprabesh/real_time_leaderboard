import { createClient } from 'redis';

export default async function configRedis() {
    try {
        const client = createClient({
            username: 'default',
            password: process.env.REDIS_PASSWORD,
            socket: {
                host: process.env.REDIS_HOST,
                port: 18090
            }
        });
        client.on("connect",()=> console.log("client is connecting..."))
        client.on("ready",()=>{console.log("redis is ready..")})
        client.on('error', err => console.log('Redis Client Error', err));

        await client.connect();

        return client;
    } catch (error) {
        console.error("erro while connecting to redis", error)
    }

}

