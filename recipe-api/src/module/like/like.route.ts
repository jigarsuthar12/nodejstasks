import { Router } from "express";
import { Middleware } from "../../middlware";
import { LikeController } from "./like.controller";

const router = Router();
const followController = new LikeController();

router.get("/:recipeId", Middleware.auth, followController.getLikes);
router.post("/:likeId", Middleware.auth, followController.addLikes);
router.delete("/:recipeId", Middleware.auth, followController.removeLikes);

export const likeRoutes: Router = router;
