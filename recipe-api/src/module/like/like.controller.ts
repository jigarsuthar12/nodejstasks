import { NextFunction, Request, Response } from "express";
import Like from "../../models/like.model";
import Recipe from "../../models/recipe.model";
import User from "../../models/user.model";

export class LikeController {
  public async getLikes(req: Request, res: Response, next: NextFunction) {
    const recipeId = req.params.recipeId;
    const id = req.body.decoded.id;
    try {
      const likes = (await Like.findAll({ where: { UserId: id, RecipeId: recipeId } })) as any;
      const usernames = [];
      const recipes = [];

      const alllikesnames = await Promise.all(
        likes.map(async follower => {
          const userId = follower.UserId;
          const user = (await User.findOne({ where: { id: userId } })) as any;
          const recipe = await Recipe.findOne({ where: { id: recipeId } });
          usernames.push(user.name);
          recipes.push(recipe);
          return { ...follower.toJSON(), UserId: usernames, recipe: recipe };
        }),
      );
      if (likes) {
        return res.status(200).json({ message: "got your likes ", likes: alllikesnames });
      } else {
        return res.status(404).json({ message: "can not have any likes!" });
      }
    } catch (err) {
      return res.status(404).json({ error: "there is error in getting likes" });
    }
  }
  public async addLikes(req: Request, res: Response, next: NextFunction) {
    const id = req.body.decoded.id;
    const recipeId = req.params.likeId;

    try {
      const added_like = await Like.create({
        UserId: id,
        RecipeId: recipeId,
      });
      if (added_like) {
        return res.status(200).json({ message: "recipe like is added!", like: added_like });
      } else {
        return res.status(400).json({ message: "can not add any likes!" });
      }
    } catch (err) {
      return res.status(404).json({ error: "can not add any like!!" });
    }
  }
  public async removeLikes(req: Request, res: Response, next: NextFunction) {
    const id = req.body.decoded.id;
    const recipeId = req.params.recipeId;

    try {
      const remove_like = await Like.destroy({
        where: {
          UserId: id,
          RecipeId: recipeId,
        },
      });
      if (remove_like) {
        return res.status(200).json({ message: "like is removed!" });
      } else {
        return res.status(404).json({ error: "like is not removed!!" });
      }
    } catch (err) {
      return res.status(404).json({ error: "can not remove likes!" });
    }
  }
}
