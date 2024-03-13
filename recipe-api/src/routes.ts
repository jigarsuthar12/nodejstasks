import { Router } from "express";
import { commentRoutes } from "./module/comment/comment.route";
import { followerRoutes } from "./module/follow/follow.route";
import { likeRoutes } from "./module/like/like.route";
import { listRoutes } from "./module/list/list.route";
import { recipeRoutes } from "./module/recipe/recipe.route";
import { userRoutes } from "./module/user/user.route";
export class Routes {
  public configure() {
    const router = Router();
    router.use("/api/v1/user", userRoutes);
    router.use("/api/v1/recipe", recipeRoutes);
    router.use("/api/v1/follow", followerRoutes);
    router.use("/api/v1/comment", commentRoutes);
    router.use("/api/v1/like", likeRoutes);
    router.use("/api/v1/list", listRoutes);
    router.all("/*", (req, res) => {
      res.status(404).json({ message: "Page Not Found!!" });
    });

    return router;
  }
}
