import { NextFunction, Request, Response } from "express";
import Follower from "../../models/follower.model";

export class FollowController {
  public async getFollowers(req: Request, res: Response, next: NextFunction) {
    const id = req.body.decoded.id;
    try {
      const allFollowers = await Follower.findAll({ where: { UserId: id } });
      if (allFollowers) {
        return res.status(200).json({ message: "all followers are", allFollowers });
      } else {
        return res.status(404).json({ message: "can not have any follower!!" });
      }
    } catch (err) {
      return res.status(404).json({ message: "can not find any follower!" });
    }
  }
  public async addFollower(req: Request, res: Response, next: NextFunction) {
    const id = req.body.decoded.id;
    const followedId = req.params.userId;

    try {
      const follower = await Follower.create({ UserId: id, FollowedId: followedId });
      return res.status(201).json({ message: "follower is created!", follower: follower });
    } catch (err) {
      return res.status(404).json({ message: "can not add follower!" });
    }
  }
  public async deleteFollower(req: Request, res: Response, next: NextFunction) {
    const id = req.body.decoded.id;
    const userid = req.params.userId;
    try {
      const delete_follower = await Follower.destroy({ where: { FollowedId: userid } });
      if (delete_follower) {
        return res.status(200).json({ message: "follower is removed!" });
      } else {
        return res.status(404).json({ message: "can not remove follower!" });
      }
    } catch (err) {
      return res.status(404).json({ error: "error is there in removing follower!", err });
    }
  }
}
