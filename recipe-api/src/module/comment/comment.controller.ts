import { NextFunction, Request, Response } from "express";
import Comment from "../../models/comment.model";

export class CommentController {
  public async getComments(req: Request, res: Response, next: NextFunction) {
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
  public async addComment(req: Request, res: Response, next: NextFunction) {
    const id = req.body.decoded.id;
    const recipeId = req.params.recipeId;
    const description = req.body.description;
    const flag = req.query.flag as any;

    if (flag === true) {
      const comment = (await Comment.create({
        description: description,
        RecipeId: recipeId,
        commentatorId: id,
        flag: flag,
      })) as any;
      return res.status(201).json({ message: "replied comment is added", comment });
    }
    const comment = (await Comment.create({
      description: description,
      RecipeId: recipeId,
      commentatorId: id,
    })) as any;

    return res.status(201).json({ message: "Comment is created!!", comment });
  }
  public async deleteComment(req: Request, res: Response, next: NextFunction) {
    const id = req.body.decoded.id;
    const recipeId = req.params.recipeId;
    const commentId = req.params.commentId;
    try {
      const deleted_comment = await Comment.destroy({
        where: { RecipeId: recipeId, commentatorId: id, commentId: commentId },
      });
      return res.status(200).json({ message: "recipe comments are deleted!" });
    } catch (err) {
      return res.status(404).json({ error: "can not destroy any" });
    }
  }
  public async updateComment(req: Request, res: Response, next: NextFunction) {
    const id = req.body.decoded.id;
    const commentId = req.params.commentId;
    const description = req.body.description;
    const recipeId = req.params.recipeId;

    const updated_comment = await Comment.update(
      {
        description: description,
      },
      { where: { commentatorId: id, id: commentId, recipeId: recipeId } },
    );
    return res.status(200).json({ message: "comment is updated!!", updated_comment });
  }
}
