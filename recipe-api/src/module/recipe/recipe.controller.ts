import { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";
import Follower from "../../models/follower.model";
import Ingredient from "../../models/ingredient.model";
import Recipe from "../../models/recipe.model";
import User from "../../models/user.model";

export class RecipeController {
  public async getRecipes(req: Request, res: Response, next: NextFunction) {
    const userid = req.body.decoded.id;
    const user = (await User.findOne({ where: { id: userid } })) as any;
    try {
      if (user.RollId === 1) {
        const recipes = await Recipe.findAll();
        return res.status(200).json({ message: "Get all recipes", recipes: recipes });
      }
      const recipes = await Recipe.findAll({ where: { UserId: userid, hide_flag: 0, deleted_flag: 0 } });
      return res.status(200).json({ message: "got all your recipes", recipes: recipes });
    } catch (err) {
      return res.status(404).json({ message: "recipes not found" });
    }
  }
  public async getRecipesWhomIFollow(req: Request, res: Response, next: NextFunction) {
    const userid = req.body.decoded.id;
    const userwhomifollowids = (await Follower.findAll({ where: { UserId: userid } })) as any;
    const recipes = [];
    for (const userwhomfollow of userwhomifollowids) {
      const id = userwhomfollow.FollowedId;
      const recipe = await Recipe.findOne({ where: { UserId: id } });
      recipes.push(recipe);
    }
    return res.status(200).json({ message: "got all recipes that whom you follow", recipes });
  }
  public async createRecipe(req: Request, res: Response, next: NextFunction) {
    const userid = req.body.decoded.id;
    const name = req.body.recipename;
    const type = req.body.type;
    const recipeId = req.query.recipeId;
    const tag = req.body.tag;
    const recipe = (await Recipe.findOne({ where: { id: recipeId } })) as any;
    const ingredient = [];
    for (const recipeIngredient of recipe.ingredient) {
      const allingredient = await Ingredient.findOne({ where: { id: recipeIngredient } });
      ingredient.push({ allingredient });
    }
    const ingredientbody = req.body.ingredient || ingredient;
    const ingredientIds = [];
    try {
      if (type === "own") {
        const recipe = (await Recipe.create({
          UserId: userid,
          name: name,
          type: type,
          tag: tag,
        })) as any;
        for (const ingredient of ingredientbody) {
          const added_ingredient = (await Ingredient.create({
            name: ingredient.name,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
            RecipeId: recipe.id,
            UserId: userid,
          })) as any;
          ingredientIds.push(added_ingredient.id);
        }
        const updated_recipe = await Recipe.update(
          {
            ingredient: ingredientIds,
          },
          { where: { id: recipe.id } },
        );
      } else {
        for (const ingredient of ingredientbody) {
          const newIngredient = (await Ingredient.create({
            name: ingredient.name,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
            RecipeId: recipe.id,
            UserId: userid,
          })) as any;

          ingredientIds.push(newIngredient.id);
        }

        const newrecipe = await Recipe.create({
          name: name || recipe.name,
          ingredient: ingredientIds || recipe.ingredient,
          type: type,
          forked_id: recipe.id,
          restore_flag: recipe.restore_flag,
          hide_flag: recipe.hide_flag,
          tag: recipe.tag,
          UserId: userid,
        });

        return res.status(200).json({ message: "Forked recipe is added!", updatedRecipe: newrecipe });
      }

      return res.status(201).json({ message: "recipe & ingredient is created!!" });
    } catch (err) {
      return res.status(201).json({ message: "can not create recipe!", err: err });
    }
  }
  public async updateRecipe(req: Request, res: Response, next: NextFunction) {
    const id = req.body.decoded.id;

    const recipeId = req.params.recipeId;
    const recipe = (await Recipe.findOne({ where: { id: recipeId } })) as any;
    const updated_name = req.body.name || recipe.name;
    const updated_ingredient = req.body.ingredient;
    const updated_type = req.body.type || recipe.type;
    const oldIngredientIds = [];
    try {
      for (const ingredient of updated_ingredient) {
        const found_ingredient = (await Ingredient.findOne({ where: { name: ingredient.name } })) as any;
        if (found_ingredient) {
          const updated_ingredient = (await Ingredient.update(
            {
              name: ingredient.name || found_ingredient.name,
              quantity: ingredient.quantity || found_ingredient.quantity,
              unit: ingredient.unit || found_ingredient.unit,
            },
            { where: { id: found_ingredient.id }, returning: true },
          )) as any;
          oldIngredientIds.push(found_ingredient.id);
        } else {
          const newIngredient = (await Ingredient.create({
            name: ingredient.name,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
            RecipeId: recipeId,
            UserId: id,
          })) as any;

          oldIngredientIds.push(newIngredient.id);
        }
      }
      const updatedRecipe = await Recipe.update(
        {
          name: updated_name || recipe.name,
          ingredient: oldIngredientIds,
          type: updated_type || recipe.type,
        },
        {
          where: {
            UserId: id,
            id: recipeId,
            hide_flag: 0,
            deleted_flag: 0,
          },
        },
      );
      return res.status(200).json({ message: "Recipe is updated!!", updatedRecipe: updatedRecipe });
    } catch (err) {
      return res.status(404).json({ message: "can not update any recipe!" });
    }
  }
  public async deleteRecipe(req: Request, res: Response, next: NextFunction) {
    const id = req.body.decoded.id;
    const recipeId = req.params.recipeId;
    try {
      const deleteRecipe = await Recipe.update({ deleted_flag: 1 }, { where: { id: recipeId, UserId: id } });
      await Recipe.destroy({
        where: {
          createdAt: {
            [Op.lte]: new Date((new Date() as any) - 30 * 24 * 60 * 60 * 1000),
          },
        },
      });
      return res.status(200).json({ message: "recipe is deleted!" });
    } catch (err) {
      return res.status(404).json({ error: "Can not delete any data", err: err });
    }
  }

  public async restoreRecipe(req: Request, res: Response, next: NextFunction) {
    const recipeId = req.params.recipeId;
    const id = req.body.decoded.id;
    try {
      await Recipe.destroy({
        where: {
          createdAt: {
            [Op.lte]: new Date((new Date() as any) - 30 * 24 * 60 * 60 * 1000),
          },
        },
      });
      const updated_recipe = await Recipe.update(
        { deleted_flag: 0 },
        {
          where: {
            id: recipeId,
            UserId: id,
            deleted_flag: 1,
          },
        },
      );
      return res.status(200).json({ message: "recipe is restored!!" });
    } catch (err) {
      return res.status(404).json({ error: "can not restore recipe!!" });
    }
  }

  public async recipeHide(req: Request, res: Response, next: NextFunction) {
    const recipeId = req.params.recipeId;
    try {
      const hideRecipe = await Recipe.update({ hide_flag: 1 }, { where: { id: recipeId } });
      if (hideRecipe) {
        return res.status(200).json({ message: "recipe is hidden!", hideRecipe });
      } else {
        return res.status(404).json({ message: "can not hide any recipe !" });
      }
    } catch (err) {
      return res.status(404).json({ error: "can not hide recipe!!" });
    }
  }
  public async recipeShow(req: Request, res: Response, next: NextFunction) {
    const recipeId = req.params.recipeId;
    try {
      const unhideRecipe = await Recipe.update({ hide_flag: 0 }, { where: { id: recipeId } });
      if (unhideRecipe) {
        return res.status(200).json({ message: "recipe is unhidden!", unhideRecipe });
      } else {
        return res.status(404).json({ message: "can not unhide any recipe !" });
      }
    } catch (err) {
      return res.status(404).json({ error: "can not unhide recipe!!" });
    }
  }
}
