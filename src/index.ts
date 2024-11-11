import { Hono } from "hono";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { timing } from "hono/timing";

import tasks from "./routes/tasks-routes";
import { ConnectRedis } from "./libs/redis";

const app = new Hono();

(async () => {
  try {
    await ConnectRedis(); // Establece la conexión a Redis
    console.log("Conexión a Redis establecida correctamente.");

    // Middleware
    app.use(logger());
    app.use(prettyJSON());
    app.use(timing());

    // Definir las rutas
    app.route("/", tasks);

    // Iniciar el servidor
  } catch (error) {
    console.error("Error al conectar a Redis:", error);
    process.exit(1); // Si la conexión falla, salimos con código de error
  }
})();

export default app;
