import { createClient, RedisClientType } from "redis";

let redisClient: RedisClientType | null = null;

export async function ConnectRedis() {
  if (redisClient) {
    return redisClient;
  }

  try {
    redisClient = createClient();

    redisClient.on("error", (err) => {
      console.error("Redis Client Error: " + err);
    });

    await redisClient.connect();
    console.log("Conexión a Redis establecida exitosamente.");

    return redisClient;
  } catch (err) {
    console.error("Error al conectar a Redis:", err);
    throw new Error("No se pudo conectar a Redis.");
  }
}

export async function DisconnectRedis() {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    console.log("Conexión a Redis cerrada.");
  }
}
