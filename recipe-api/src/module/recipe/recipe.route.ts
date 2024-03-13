import { Router } from "express";
import { Middleware } from "../../middlware";
import { RecipeController } from "./recipe.controller";

const router = Router();
const recipeController = new RecipeController();
router.get("/", Middleware.auth, Middleware.isBlocked, recipeController.getRecipes);
router.post("/", Middleware.auth, Middleware.isBlocked, recipeController.createRecipe);
router.patch("/:recipeId", Middleware.auth, Middleware.isBlocked, recipeController.updateRecipe);
router.delete("/:recipeId", Middleware.auth, Middleware.isBlocked, recipeController.deleteRecipe);
router.patch("/restore/:recipeId", Middleware.auth, Middleware.isBlocked, recipeController.restoreRecipe);
export const recipeRoutes: Router = router;
