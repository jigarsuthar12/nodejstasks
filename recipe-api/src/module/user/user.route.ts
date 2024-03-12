import { Router } from "express";
import { Middleware } from "../../middlware";
import { UserController } from "./user.controller";

const router: Router = Router();
const userController = new UserController();

router.get("/admin", Middleware.auth, Middleware.isAdmin, userController.getUsers);

router.post("/roll", userController.createRoll);

router.post("/login", userController.loginUser);

router.post("/signup", userController.createUser);

router.patch("/:userId", Middleware.auth, Middleware.isAdmin, userController.updateUser);

router.delete("/:userId", Middleware.auth, Middleware.isAdmin, userController.deleteUser);

export const userRoutes: Router = router;
