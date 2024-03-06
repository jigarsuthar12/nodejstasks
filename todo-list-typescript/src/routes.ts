import { Router } from "express";
import { taskRoutes } from "./module/task/task.route";
import { userRoutes } from "./module/user/user.route";

export class Routes {
  public configure() {
    const router = Router();

    router.use("/api/v1/user", userRoutes);
    router.use("/api/v1/task", taskRoutes);
    router.all("/*", (req, res) => {
      res.status(404).json({ message: "Page Not Found!!" });
    });

    return router;
  }
}
