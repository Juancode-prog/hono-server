import { Hono } from "hono";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { timing } from "hono/timing";

import tasks from "./routes/tasks-routes";

const app = new Hono();

// ? Middleware
app.use(logger());
app.use(prettyJSON());
app.use(timing());

app.route("/", tasks);

export default app;
