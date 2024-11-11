import { Hono } from "hono";
import {
  createTasks,
  deleteTask,
  getAllTasks,
  getTask,
  updatedTask,
} from "../controllers/tasks.controller";

const taskRouter = new Hono();

// * Aquí si se usa Redis para la petición GET para que traiga todas las tareas y que lo almacene por 10 segundos (se puede configurar para que dure más la extinción de los datos en Redis)
taskRouter.get("/", getAllTasks);

// ! Aquí no se usa Redis porque no es necesario usarlo
taskRouter.post("/", createTasks);

// * Aquí también se puede usar Redis también porque es petición GET pero para único valor
taskRouter.get("/:id", getTask);

// ? Aquí se probara si es necesario usar Redis para la petición DELETE
taskRouter.delete("/:id", deleteTask);

// TODO Aquí no se usara Redis para la petición PUT porque va a actualizar la base de datos con Prisma y no es necesario usar Redis aquí
taskRouter.put("/:id", updatedTask);

export default taskRouter;
