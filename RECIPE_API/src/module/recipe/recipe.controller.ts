import { NextFunction, Request, Response } from "express";
import Recipe from "../../models/recipe.model";

export class RecipeController {
  public async getRecipes(req: Request, res: Response, next: NextFunction) {
    const userid = req.body.decoded.id;
    try {
      const recipes = await Recipe.findAll({ where: { UserId: userid } });
      return res.status(200).json({ message: "got all your recipes", recipes: recipes });
    } catch (err) {
      return res.status(404).json({ message: "recipes not found" });
    }
  }
  public async createRecipe(req: Request, res: Response, next: NextFunction) {
    const userid = req.body.decoded.id;
    const id = req.params.userId;
    const recipeId = req.params.recipeId;
    const name = req.body.recipename;
    const ingredient = req.body.ingredient;
    const type = req.body.type;

    try {
      if (type === "forked") {
        const forkedrecipe = await Recipe.findOne({ where: { UserId: id, id: recipeId } });
        if (!forkedrecipe) {
          return res.status(404).json({ error: "can not get any recipe!!" });
        }
        const recipe = await Recipe.create({
          UserId: userid,
          name: name,
          ingredient: [ingredient],
          type: type,
          forked_recipe: [forkedrecipe],
        });
        return res.status(200).json({ message: "forked recipe is created got!", forkedRE: recipe });
      } else {
        const recipe = await Recipe.create({
          UserId: userid,
          name: name,
          ingredient: [ingredient],
          type: type,
        });
        return res.status(201).json({ message: "recipe is created!!", recipe: recipe });
      }
    } catch (err) {
      return res.status(404).json({ error: "can not create any recipe!" });
    }
  }
  public async updateRecipe(req: Request, res: Response, next: NextFunction) {
    const id = req.body.decoded.id;
    const recipeId = req.params.recipeId;
    const updated_name = req.body.name;
    const updated_ingredient = req.body.ingredient;

    try {
      const updatedRecipe = await Recipe.update(
        {
          name: updated_name,
          updated_ingredient: updated_ingredient,
        },
        {
          where: {
            UserId: id,
            id: recipeId,
          },
        },
      );
      if (!updatedRecipe) {
        return res.status(404).json({ error: "can not update recipe u are not authorized!!" });
      }
      return res.status(200).json({ message: "Recipe is updated!!", updatedRecipe: updatedRecipe });
    } catch (err) {
      return res.status(404).json({ error: "can not update any user!", err: err });
    }
  }
  //   public async deleteRecipe(req: Request, res: Response, next: NextFunction) {}
}
