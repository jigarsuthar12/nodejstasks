import { NextFunction, Request, Response } from "express";

export class LikeController {
  public async getLikes(req: Request, res: Response, next: NextFunction) {}
  public async addLikes(req: Request, res: Response, next: NextFunction) {}
  public async deleteLikes(req: Request, res: Response, next: NextFunction) {}
}
