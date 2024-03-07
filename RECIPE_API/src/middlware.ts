import { NextFunction, Request, Response } from "express";
import { Jwt } from "./helper/jwt.helper";
export class Middleware {
  public static async auth(req: Request, res: Response, next: NextFunction) {
    res.set("Content-Type", "application/json");
    res.set("Authorization", "Bearer ");
    if (req.headers.authorization) {
      const tokenInfo = Jwt.decode(req.headers.authorization.toString().replace("Bearer ", ""));
      if (tokenInfo) {
        req.body.decoded = tokenInfo;
        console.log("user is authorized");
        next();
      } else {
        res.status(401).json({ error: "Unauthorized", code: 401 });
        return;
      }
    }
  }
}
