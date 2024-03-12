import { Router } from "express";
import { Middleware } from "../../middlware";
import { RecipeController } from "./recipe.controller";

const router = Router();
const recipeController = new RecipeController();
router.get("/", Middleware.auth, recipeController.getRecipes);
router.post("/", Middleware.auth, recipeController.createRecipe);
router.patch("/:recipeId", Middleware.auth, recipeController.updateRecipe);
router.delete("/:recipeId", Middleware.auth, recipeController.deleteRecipe);
export const recipeRoutes: Router = router;
