import { NextFunction, Request, Response } from "express";
import Recipe from "../../models/recipe.model";
import User from "../../models/user.model";

export class RecipeController {
  public async getRecipes(req: Request, res: Response, next: NextFunction) {
    const userid = req.body.decoded.id;
    try {
      const user = (await User.findOne({ where: { id: userid } })) as any;
      if (user.RollId === 1) {
        const recipes = await Recipe.findAll();
        return res.status(200).json({ message: "Get all recipes", recipes: recipes });
      }
      const recipes = await Recipe.findAll({ where: { UserId: userid } });
      return res.status(200).json({ message: "got all your recipes", recipes: recipes });
    } catch (err) {
      return res.status(404).json({ message: "recipes not found" });
    }
  }
  public async createRecipe(req: Request, res: Response, next: NextFunction) {
    const userid = req.body.decoded.id;
    const name = req.body.recipename;
    const ingredient = req.body.ingredient;
    const type = req.body.type;
    try {
      const recipe = await Recipe.create({
        UserId: userid,
        name: name,
        ingredient: [ingredient],
        type: type,
      });
      return res.status(201).json({ message: "recipe is created!!", recipe: recipe });
    } catch (err) {
      return res.status(201).json({ message: "can not create recipe!", err: err });
    }
  }
  public async updateRecipe(req: Request, res: Response, next: NextFunction) {
    const id = req.body.decoded.id;
    const recipeId = req.params.recipeId;
    const updated_name = req.body.name;
    const updated_ingredient = req.body.ingredient;
    const updated_type = req.body.type;

    try {
      if (updated_type === "forked") {
        const recipe = (await Recipe.findOne({ where: { id: recipeId } })) as any;

        const updated_recipe = await Recipe.create({
          name: updated_name || recipe.name,
          ingredient: updated_ingredient || recipe.ingredient,
          type: updated_type,
          forked_id: recipe.id,
          UserId: id,
        });

        return res.status(200).json({ message: "Forked recipe is added!", updatedRecipe: updated_recipe });
      } else {
        const updatedRecipe = await Recipe.update(
          {
            name: updated_name,
            ingredient: updated_ingredient,
          },
          {
            where: {
              UserId: id,
              id: recipeId,
            },
          },
        );
        return res.status(200).json({ message: "Recipe is updated!!", updatedRecipe: updatedRecipe });
      }
    } catch (err) {
      return res.status(404).json({ error: "can not update any user!", err: err });
    }
  }
  //   public async deleteRecipe(req: Request, res: Response, next: NextFunction) {}
}
