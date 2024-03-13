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
router.get("/:userId", Middleware.auth, recipeController.getRecipesWhomIFollow);

router.patch("/:recipeId", Middleware.auth, Middleware.isAdmin, recipeController.recipeHide);
router.patch("/:recipeId", Middleware.auth, Middleware.isAdmin, recipeController.recipeShow);
export const recipeRoutes: Router = router;
