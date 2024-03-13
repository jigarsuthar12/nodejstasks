import { Router } from "express";
import { Middleware } from "../../middlware";
import { CommentController } from "./comment.controller";

const router = Router();
const followController = new CommentController();

router.get("/:recipeId", Middleware.auth, Middleware.isBlocked, followController.getComments);
router.post("/:recipeId", Middleware.auth, Middleware.isBlocked, followController.addComments);
router.patch("/:recipeId/:commentId", Middleware.auth, Middleware.isBlocked, followController.updateComments);
router.delete("/:recipeId/:commentId", Middleware.auth, Middleware.isBlocked, followController.deleteComment);

export const commentRoutes: Router = router;
