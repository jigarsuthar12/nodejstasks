import { Router } from "express";
import { UserController } from "./user.controller";

const router: Router = Router();
const userController = new UserController();

router.get("/", userController.getUsers);

router.post("/login", userController.loginUser);

router.post("/", userController.postUser);

router.patch("/:userId", userController.updateUser);

router.delete("/:userId", userController.deleteUser);

export const userRoutes: Router = router;
