import { NextFunction, Request, Response } from "express";
import { Jwt } from "./helper/jwt.helper";
import User from "./models/user.model";
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
  public static async isAdmin(req: Request, res: Response, next: NextFunction) {
    const id = req.body.decoded.id;
    const user = User.findOne({ where: { id: id } }) as any;
    if (user.id !== 1) {
      return res.status(401).json({ message: "you are not authorized!!" });
    } else {
      console.log("admin authorized!!");

      next();
    }
  }
  public static async isBlocked(req: Request, res: Response, next: NextFunction) {
    const id = req.body.decoded.id;
    const user = (await User.findOne({ where: { id: id } })) as any;
    if (user.block_flag === 1) {
      return res.status(401).json({ message: "User can not have access by admin" });
    } else {
      console.log("user is not blocked!");
      next();
    }
  }
}
