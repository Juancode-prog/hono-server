import { ConnectRedis } from "../libs/redis";
import { Prisma } from "@prisma/client";
import { prisma } from "../libs/prisma";

export async function findAll() {
  try {
    const client = await ConnectRedis();
    const reply = await client.get("tasks");

    const tasks = await prisma.tasks.findMany();

    await client.set("tasks", JSON.stringify(tasks), {
      EX: 15,
      NX: true,
    });

    return { reply, tasks };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      const meesage = error.message + error.errorCode;
      throw new Error(meesage);
    } else if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Error while getting tasks");
  }
}

export async function create({
  title,
  description,
}: {
  title: string;
  description: string | null;
}) {
  try {
    const newTask = await prisma.tasks.create({
      data: {
        title,
        description,
      },
    });

    return newTask;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new Error(error.message);
      }
    }
  }
}

export async function findOne(id: string) {
  try {
    const client = await ConnectRedis();
    const reply = await client.get(id);

    const taskFound = await prisma.tasks.findUnique({
      where: {
        id: Number(id),
      },
    });

    await client.set(id, JSON.stringify(taskFound), {
      EX: 15,
      NX: true,
    });

    return { reply, taskFound };
  } catch (err) {
    if (err instanceof Error) {
      console.error(err);
      throw new Error(err.message);
    }
    throw new Error("Error getting task information");
  }
}

export async function remove(id: string) {
  try {
    const taskFound = await prisma.tasks.delete({
      where: {
        id: Number(id),
      },
    });

    return taskFound;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    throw new Error("Error deleting task information");
  }
}

export async function updated({
  id,
  title,
  description,
}: {
  id: string;
  title: string;
  description: string | null;
}) {
  try {
    const updatedTasks = await prisma.tasks.update({
      where: {
        id: Number(id),
      },
      data: {
        title,
        description,
      },
    });

    return updatedTasks;
  } catch (err) {
    if (err instanceof Error) {
      console.error(err);
      throw new Error(err.message);
    }
    throw new Error("Error updating task");
  }
}
