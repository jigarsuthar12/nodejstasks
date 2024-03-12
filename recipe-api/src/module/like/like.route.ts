import { Router } from "express";
import { Middleware } from "../../middlware";
import { LikeController } from "./like.controller";

const router = Router();
const followController = new LikeController();

router.get("/", Middleware.auth, followController.getLikes);

export const followerRoutes: Router = router;
