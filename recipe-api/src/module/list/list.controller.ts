import { NextFunction, Request, Response } from "express";
import Comment from "../../models/comment.model";
import Ingredient from "../../models/ingredient.model";
import Recipe from "../../models/recipe.model";
import User from "../../models/user.model";

export class ListController {
  public async getOwnList(req: Request, res: Response, next: NextFunction) {
    const id = req.body.decoded.id;
    try {
      const recipes = (await Recipe.findAll({ where: { UserId: id, hide_flag: 0, deleted_flag: 0 } })) as any;
      const updatedRecipes = await Promise.all(
        recipes.map(async item => {
          const fullIngredients = [];
          await Promise.all(
            item.ingredient.map(async ingredientId => {
              const ingredientDatabase = await Ingredient.findOne({ where: { id: ingredientId } });
              fullIngredients.push(ingredientDatabase);
            }),
          );
          const comments = (await Comment.findAll({ where: { recipeId: item.id } })) as any;
          const updated_comment = await Promise.all(
            comments.map(async comment => {
              const commentatorId = comment.commentatorId;
              const commentUserId = comment.commentId;
              const commentUser = [];
              if (commentUserId) {
                const commentUsers = await User.findOne({ where: { id: commentUserId } });
                const replied_commnet = {
                  commentUser: commentUsers,
                  replie: comment.comment,
                };
                commentUser.push(replied_commnet);
              }

              const commentator = await User.findOne({ where: { id: commentatorId } });

              return { ...comment.toJSON(), replied_comments: commentUser, commentatorId: commentator };
            }),
          );
          return { ...item.toJSON(), ingredient: fullIngredients, comments: updated_comment };
        }),
      );
      if (updatedRecipes) {
        return res.status(200).json({ message: "your recipes are", recipe: updatedRecipes });
      } else {
        return res.status(404).json({ message: "can not find any recipes!!" });
      }
    } catch (err) {
      return res.status(404).json({ error: "error in finding in list" });
    }
  }
  public async getRecipeByTagOrName(req: Request, res: Response, next: NextFunction) {
    const id = req.body.decoded.id;
    const tagname = req.query.tag;
    const name = req.query.recipename;

    if (tagname) {
      const recipes = (await Recipe.findAll({ where: { tag: tagname, hide_flag: 0, deleted_flag: 0 } })) as any;
      if (recipes) {
        const updatedRecipes = await Promise.all(
          recipes.map(async item => {
            const fullIngredients = [];
            await Promise.all(
              item.ingredient.map(async ingredientId => {
                const ingredientDatabase = await Ingredient.findOne({ where: { id: ingredientId } });
                fullIngredients.push(ingredientDatabase);
              }),
            );
            return { ...item.toJSON(), ingredient: fullIngredients };
          }),
        );

        return res.status(200).json({ message: "got all your recipes!", recipe: updatedRecipes });
      } else {
        return res.status(404).json({ message: "can not get any recipe by this tag" });
      }
    } else if (name) {
      const recipes = (await Recipe.findAll({ where: { name: name, hide_flag: 0, deleted_flag: 0 } })) as any;
      if (recipes) {
        const updatedRecipes = await Promise.all(
          recipes.map(async item => {
            const fullIngredients = [];
            await Promise.all(
              item.ingredient.map(async ingredientId => {
                const ingredientDatabase = await Ingredient.findOne({ where: { id: ingredientId } });
                fullIngredients.push(ingredientDatabase);
              }),
            );
            const comments = (await Comment.findAll({ where: { recipeId: item.id } })) as any;
            const updated_comment = await Promise.all(
              comments.map(async comment => {
                const commentatorId = comment.commentatorId;
                const commentUserId = comment.commentId;
                const commentUser = [];
                if (commentUserId) {
                  const commentUsers = await User.findOne({ where: { id: commentUserId } });
                  const replied_commnet = {
                    commentUser: commentUsers,
                    replie: comment.comment,
                  };
                  commentUser.push(replied_commnet);
                }

                const commentator = await User.findOne({ where: { id: commentatorId } });

                return { ...comment.toJSON(), replied_comments: commentUser, commentatorId: commentator };
              }),
            );

            return { ...item.toJSON(), ingredient: fullIngredients, comments: updated_comment };
          }),
        );
        return res.status(200).json({ message: "got all your recipes!", recipe: updatedRecipes });
      } else {
        return res.status(404).json({ message: "can not get any recipe by this tag" });
      }
    }
  }
}
