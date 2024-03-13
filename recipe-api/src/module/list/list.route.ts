import { Router } from "express";
import { Middleware } from "../../middlware";
import { ListController } from "./list.controller";

const router = Router();
const listController = new ListController();
router.get("/", Middleware.auth, Middleware.isBlocked, listController.getOwnList);
router.get("/", Middleware.auth, Middleware.isBlocked, listController.getRecipeByTagOrName);

export const listRoutes: Router = router;
