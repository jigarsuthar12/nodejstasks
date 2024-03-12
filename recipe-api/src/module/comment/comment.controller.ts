import { NextFunction, Request, Response } from "express";

export class CommentController {
  public async getComments(req: Request, res: Response, next: NextFunction) {}
  public async addComments(req: Request, res: Response, next: NextFunction) {
    const id = req.body.decoded.id;
    const recipeId = req.params.recipeId;
    const description = req.body.description;
  }
}
