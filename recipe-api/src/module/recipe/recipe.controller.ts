import { NextFunction, Request, Response } from "express";
import Ingredient from "../../models/ingredient.model";
import Recipe from "../../models/recipe.model";
import User from "../../models/user.model";

export class RecipeController {
  public async getRecipes(req: Request, res: Response, next: NextFunction) {
    const userid = req.body.decoded.id;
    const user = (await User.findOne({ where: { id: userid } })) as any;
    if (user.block_flag === 1) {
      return res.status(404).json({ message: "User can not have access by admin" });
    }
    try {
      if (user.RollId === 1) {
        const recipes = await Recipe.findAll({ where: { deleted_flag: 0, hide_flag: 0 } });
        return res.status(200).json({ message: "Get all recipes", recipes: recipes });
      }
      const recipes = await Recipe.findAll({ where: { UserId: userid, hide_flag: 0, deleted_flag: 0 } });
      return res.status(200).json({ message: "got all your recipes", recipes: recipes });
    } catch (err) {
      return res.status(404).json({ message: "recipes not found" });
    }
  }
  public async createRecipe(req: Request, res: Response, next: NextFunction) {
    const userid = req.body.decoded.id;
    const user = (await User.findOne({ where: { id: userid } })) as any;
    if (user.block_flag === 1) {
      return res.status(404).json({ message: "User can not have access by admin" });
    }
    const name = req.body.recipename;
    const type = req.body.type;

    const ingredientbody = req.body.ingredient;
    const min = 1;
    const max = 99999;
    const randomNum = (Math.floor(Math.random() * (max - min + 1)) + min).toString();
    try {
      const recipe = (await Recipe.create({
        UserId: userid,
        name: name,
        type: type,
        tag: `#${randomNum}`,
      })) as any;
      const ingredientIds = [];
      for (const ingredient of ingredientbody) {
        const added_ingredient = (await Ingredient.create({ name: ingredient.name, quntity: ingredient.quantity, unit: ingredient.unit, RecipeId: recipe.id })) as any;
        ingredientIds.push(added_ingredient.id);
      }
      const updated_recipe = await Recipe.update(
        {
          ingredient: ingredientIds,
        },
        { where: { id: recipe.id } },
      );
      return res.status(201).json({ message: "recipe & ingredient is created!!", recipe: updated_recipe });
    } catch (err) {
      return res.status(201).json({ message: "can not create recipe!", err: err });
    }
  }
  public async updateRecipe(req: Request, res: Response, next: NextFunction) {
    const id = req.body.decoded.id;
    const user = (await User.findOne({ where: { id: id } })) as any;
    if (user.block_flag === 1) {
      return res.status(404).json({ message: "User can not have access by admin" });
    }
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
          restore_flag: recipe.restore_flag,
          hide_flag: recipe.hide_flag,
          tag: recipe.tag,
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
              hide_flag: 0,
            },
          },
        );
        return res.status(200).json({ message: "Recipe is updated!!", updatedRecipe: updatedRecipe });
      }
    } catch (err) {
      return res.status(404).json({ error: "can not update any user!", err: err });
    }
  }
  public async deleteRecipe(req: Request, res: Response, next: NextFunction) {
    const id = req.body.decoded.id;
    const user = (await User.findOne({ where: { id: id } })) as any;
    const recipeId = req.params.recipeId;
    if (user.block_flag === 1) {
      return res.status(404).json({ message: "User can not have access by admin" });
    }
    try {
      const deleteRecipe = await Recipe.update({ deleted_flag: 1 }, { where: { id: recipeId, UserId: user.id } });
      return res.status(200).json({ message: "recipe is deleted!" });
    } catch (err) {
      return res.status(404).json({ error: "Can not delete any data", err: err });
    }
  }
}
