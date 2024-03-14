import { Router } from "express";
import { Middleware } from "../../middlware";
import { ListController } from "./list.controller";

const router = Router();
const listController = new ListController();
router.get("/filter", Middleware.auth, Middleware.isBlocked, listController.getRecipeByTagOrName);
router.get("/getOwnlist", Middleware.auth, Middleware.isBlocked, listController.getOwnList);

export const listRoutes: Router = router;
