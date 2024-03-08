import { Router } from "express";
import { Middleware } from "../../middlware";
import { RecipeController } from "./recipe.controller";

const router = Router();
const recipeController = new RecipeController();
router.get("/:recipeId", Middleware.auth, recipeController.getRecipes);
router.post("/", Middleware.auth, recipeController.createRecipe);
router.patch("/:recipeId", Middleware.auth, recipeController.updateRecipe);
export const recipeRoutes: Router = router;
