import { Router } from "express";
import { Middleware } from "../../middlware";
import { UserController } from "./user.controller";

const router: Router = Router();
const userController = new UserController();

router.get("/admin", Middleware.auth, userController.getUsers);

router.post("/roll", userController.createRoll);

router.post("/login", userController.loginUser);

router.post("/signup", userController.createUser);

router.patch("/admin/:userId", Middleware.auth, userController.updateUser);

router.delete("/admin/:userId", Middleware.auth, userController.deleteUser);

export const userRoutes: Router = router;
