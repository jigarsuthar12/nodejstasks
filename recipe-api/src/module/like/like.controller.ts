import { NextFunction, Request, Response } from "express";
import Like from "../../models/like.model";

export class LikeController {
  public async getLikes(req: Request, res: Response, next: NextFunction) {
    const recipeId = req.params.recipeId;
    const id = req.body.decoded.id;
    try {
      const likes = await Like.findAll({ where: { UserId: id, RecipeId: recipeId } });
      if (likes) {
        return res.status(200).json({ message: "got your likes ", likes: likes });
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
        return res.status(200).json({ message: "recipe is added!", like: added_like });
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
