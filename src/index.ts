import { Hono } from "hono";
import { logger } from "hono/logger";

const app = new Hono();

// ? Middleware
app.use(logger());

app.get("/", (c) => {
  return c.json({msg: "Hello Hono!"});
});

export default app;
