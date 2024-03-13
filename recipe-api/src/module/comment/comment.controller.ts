import { NextFunction, Request, Response } from "express";
import Comment from "../../models/comment.model";

export class CommentController {
  public async getComments(req: Request, res: Response, next: NextFunction) {
    const id = req.body.decode.id;
    const recipeId = req.params.recipeId;
    try {
      const comments = await Comment.findAll({ where: { RecipeId: recipeId } });
      if (comments) {
        return res.status(200).json({ message: "got all recipes comments", comments: comments });
      } else {
        return res.status(404).json({ message: "recipe has no comments" });
      }
    } catch (err) {
      return res.status(404).json({ error: "can not get any comments!", err: err });
    }
  }
  public async addComments(req: Request, res: Response, next: NextFunction) {
    const id = req.body.decoded.id;
    const recipeId = req.params.recipeId;
    const description = req.body.description;
    const comment = (await Comment.create({
      description: description,
      RecipeId: recipeId,
      commentatorId: id,
    })) as any;

    return res.status(201).json({ message: "Comment is created!!", comment });
  }
  public async deleteComments(req: Request, res: Response, next: NextFunction) {
    const id = req.body.decoded.id;
    const recipeId = req.params.recipeId;
    try {
      const deleted_comment = await Comment.destroy({
        where: { RecipeId: recipeId, UserId: id },
      });
      return res.status(200).json({ message: "recipe comments are deleted!" });
    } catch (err) {
      return res.status(404).json({ error: "can not destroy any" });
    }
  }
  public async updateComments(req: Request, res: Response, next: NextFunction) {}
}
