import { Router } from "express";
import { Middleware } from "../../middlware";
import { FollowController } from "./follow.controller";

const router = Router();
const followController = new FollowController();

router.get("/", Middleware.auth, followController.getFollowers);

router.post("/:recipeId", Middleware.auth, followController.addFollower);

export const followerRoutes: Router = router;
