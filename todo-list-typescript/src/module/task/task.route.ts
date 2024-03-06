import { Router } from "express";
import { Middleware } from "../../middleware";
import { TaskController } from "../task/task.controller";
const router: Router = Router();
const taskController = new TaskController();

router.get("/", Middleware.auth, taskController.getAllTasks);
router.post("/", Middleware.auth, taskController.createTask);
router.patch("/:id", Middleware.auth, taskController.updateTask);
router.delete("/:id", Middleware.auth, taskController.deleteTask);

export const taskRoutes: Router = router;
