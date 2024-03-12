import { Router } from "express";
import { followerRoutes } from "./module/follow/follow.route";
import { recipeRoutes } from "./module/recipe/recipe.route";
import { userRoutes } from "./module/user/user.route";
export class Routes {
  public configure() {
    const router = Router();
    router.use("/api/v1/user", userRoutes);
    router.use("/api/v1/recipe", recipeRoutes);
    router.use("/api/v1/follow", followerRoutes);
    router.all("/*", (req, res) => {
      res.status(404).json({ message: "Page Not Found!!" });
    });

    return router;
  }
}
