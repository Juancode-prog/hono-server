import { Hono } from "hono";
import { prisma } from "../libs/prisma";
import { Prisma, Tasks } from "@prisma/client";
import { ConnectRedis } from "../libs/redis";

const taskRouter = new Hono();

// * Aquí si se usa Redis para la petición GET para que traiga todas las tareas y que lo almacene por 10 segundos (se puede configurar para que dure más la extinción de los datos en Redis)
taskRouter.get("/", async (c) => {
  try {
    const client = await ConnectRedis();
    const reply = await client.get("tasks");

    if (reply) {
      return c.json(JSON.parse(reply), 200);
    }

    const tasks = await prisma.tasks.findMany();

    await client.set("tasks", JSON.stringify(tasks), {
      EX: 15,
      NX: true,
    });
    return c.json(tasks, 200);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      return c.json({ errorPrisma: error.message, status: error.errorCode });
    } else if (error instanceof Error) {
      return c.json({ errorServer: error.message });
    }
    throw new Error("Error while getting tasks");
  }
});

// ! Aquí no se usa Redis porque no es necesario usarlo
taskRouter.post("/", async (c) => {
  try {
    const { title, description } = await c.req.json<Tasks>();

    if (!title || !description) {
      return c.json({ msg: "Title and description is required" }, 400);
    }

    const newTask = await prisma.tasks.create({
      data: {
        title,
        description,
      },
    });

    return c.json(newTask, 201);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2031") {
        return c.json({ msg: error.message });
      }
    }
  }
});

// * Aquí también se puede usar Redis también porque es petición GET pero para único valor
taskRouter.get("/:id", async (c) => {
  const { id } = c.req.param();
  try {
    const client = await ConnectRedis();
    const reply = await client.get(id);

    if (reply) {
      return c.json(reply, 200);
    }

    const taskFound = await prisma.tasks.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!taskFound) {
      return c.json({ msg: "Task not found" }, 404);
    }

    await client.set(id, JSON.stringify(taskFound), {
      EX: 15,
      NX: true
    });

    return c.json(taskFound, 200);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err);
      return c.json({ errorServer: err.message });
    }
    throw new Error("Error getting task information");
  }
});

// ? Aquí se probara si es necesario usar Redis para la petición DELETE
taskRouter.delete("/:id", async (c) => {
  const { id } = c.req.param();
  try {
    const taskFound = await prisma.tasks.delete({
      where: {
        id: Number(id),
      },
    });

    if (!taskFound) {
      return c.json({ msg: "Task not found" }, 404);
    }

    return c.json(taskFound, 204);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err);
      return c.json({ errorServer: err.message });
    }
    throw new Error("Error deleting task information");
  }
});

// TODO Aquí no se usara Redis para la petición PUT porque va a actualizar la base de datos con Prisma y no es necesario usar Redis aquí
taskRouter.put("/:id", async (c) => {
  const { id } = c.req.param();
  try {
    const { title, description } = await c.req.json<Tasks>();

    if (!title || !description) {
      return c.json({ msg: "Title and description is required" }, 400);
    }

    const updatedTasks = await prisma.tasks.update({
      where: {
        id: Number(id),
      },
      data: {
        title,
        description,
      },
    });

    return c.json(updatedTasks);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err);
      return c.json({ errorServer: err.message });
    }
    throw new Error("Error updating task");
  }
});

export default taskRouter;
