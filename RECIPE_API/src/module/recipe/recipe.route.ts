import { Router } from "express";
import { Middleware } from "../../middlware";
import { RecipeController } from "./recipe.controller";

const router = Router();
const recipeController = new RecipeController();
router.get("/", Middleware.auth, recipeController.getRecipes);
router.post("/create", Middleware.auth, recipeController.createRecipe);
router.patch("/update/:recipeId", Middleware.auth, recipeController.updateRecipe);
export const recipeRoutes: Router = router;
