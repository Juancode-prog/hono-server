import { Context } from "hono";
import { Tasks } from "@prisma/client";
import {
  create,
  findAll,
  findOne,
  remove,
  updated,
} from "../services/tasks.service";

export async function getAllTasks(c: Context) {
  const { reply, tasks } = await findAll();

  if (reply) {
    return c.json(JSON.parse(reply), 200);
  }

  return c.json(tasks, 200);
}

export async function createTasks(c: Context) {
  const { title, description } = await c.req.json<Tasks>();

  if (!title || !description) {
    return c.json({ msg: "Title and description is required" }, 400);
  }

  const newTask = await create({ title, description });

  return c.json(newTask, 201);
}

export async function getTask(c: Context) {
  const { id } = c.req.param();
  const { reply, taskFound } = await findOne(id);

  if (reply) {
    return c.json(reply, 200);
  }
  if (!taskFound) {
    return c.json({ msg: "Task not found" }, 404);
  }

  return c.json(taskFound, 200);
}

export async function deleteTask(c: Context) {
  const { id } = c.req.param();
  const taskFound = await remove(id);

  if (!taskFound) {
    return c.json({ msg: "Task not found" }, 404);
  }

  return c.json(taskFound, 204);
}

export async function updatedTask(c: Context) {
  const { id } = c.req.param();
  const { title, description } = await c.req.json<Tasks>();

  if (!title || !description) {
    return c.json({ msg: "Title and description is required" }, 400);
  }

  const updatedTasks = await updated({ id, title, description });

  return c.json(updatedTasks);
}
