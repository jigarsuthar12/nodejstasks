import { Router } from "express";
import { Middleware } from "../../middlware";
import { CommentController } from "./comment.controller";

const router = Router();
const followController = new CommentController();

router.get("/", Middleware.auth, followController.getComments);
router.post("/:recipeId", Middleware.auth, followController.addComments);

export const followerRoutes: Router = router;
