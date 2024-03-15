import { NextFunction, Request, Response } from "express";
import Comment from "../../models/comment.model";

export class CommentController {
  public async getComments(req: Request, res: Response, next: NextFunction) {
    const recipeId = req.params.recipeId;
    try {
      const comments = (await Comment.findAll({ where: { RecipeId: recipeId } })) as any;
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
    const comment = req.body.comment;
    const userId = req.query.userId;

    if (userId) {
      const addedcomment = (await Comment.create({
        comment: comment,
        RecipeId: recipeId,
        commentatorId: id,
        commentId: userId,
      })) as any;
      return res.status(201).json({ message: "replied comment is added", addedcomment });
    }
    const addedcomment = (await Comment.create({
      comment: comment,
      RecipeId: recipeId,
      commentatorId: id,
    })) as any;

    return res.status(201).json({ message: "Comment is created!!", addedcomment });
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
    const comment = req.body.commnet;
    const recipeId = req.params.recipeId;

    const updated_comment = await Comment.update(
      {
        commnet: comment,
      },
      { where: { commentatorId: id, id: commentId, recipeId: recipeId } },
    );
    return res.status(200).json({ message: "comment is updated!!", updated_comment });
  }
}
