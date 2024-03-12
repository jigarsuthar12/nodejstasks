import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import { Jwt } from "../../helper/jwt.helper";
import Roll from "../../models/roll.model";
import User from "../../models/user.model";

export class UserController {
  public async getUsers(req: Request, res: Response, next: NextFunction) {
    const id = req.body.decoded.id;
    try {
      const alluser = await User.findAll();
      return res.status(200).json({ message: "All users are:", users: alluser });
    } catch (err) {
      return res.status(404).json({ message: "can not find any users" });
    }
  }
  public async createRoll(req: Request, res: Response, next: NextFunction) {
    const { username } = req.body;
    try {
      if (!username) {
        return res.status(404).json({ error: "username is empty!" });
      }
      const roll = await Roll.create({
        name: username,
      });
      return res.status(201).json({ message: "Roll is created!", roll: roll });
    } catch (err) {
      return res.status(404).json({ error: "Can not create roll" });
    }
  }

  public async createUser(req: Request, res: Response, next: NextFunction) {
    const { username, password, rollname } = req.body;
    try {
      const roll = (await Roll.findOne({ where: { name: rollname } })) as any;
      if (!roll) {
        return res.status(404).json({ error: "roll not found!" });
      }
      const rollId = roll.id;
      const hashedpw = await bcrypt.hash(password, 12);
      const user = await User.create({
        name: username,
        password: hashedpw,
        RollId: rollId,
      });
      return res.status(201).json({ message: "user Created!", user });
    } catch (err) {
      return res.status(404).json({ error: "can not create user!", err: err });
    }
  }

  public async updateUser(req: Request, res: Response, next: NextFunction) {
    const id = req.body.decoded.id;
    const userId = req.params.userId;
    const name = req.body.name;
    const password = req.body.password;
    try {
      const user = (await User.findOne({ where: { id: id } })) as any;
      const hashedpw = await bcrypt.hash(password, 12);
      const updateduser = await User.update({ name: name || user.name, password: hashedpw || user.password }, { where: { id: userId }, returning: true });
      return res.status(200).json({ message: "user is updated!!", user: updateduser });
    } catch (err) {
      return res.status(404).json({ error: "can not update user!!", err: err });
    }
  }

  public async loginUser(req: Request, res: Response, next: NextFunction) {
    const { name, password } = req.body;
    try {
      const user = (await User.findOne({ where: { name: name } })) as any;
      if (!user) {
        return res.status(404).json({ error: "username is wrong!" });
      }
      const comparepassword = await bcrypt.compare(password, user.password);
      if (!comparepassword) {
        return res.status(404).json({ error: "password is wrong" });
      }

      const token = Jwt.encode({ id: user.id });
      return res.status(200).json({ message: "user is logged in ", token: token });
    } catch (err) {
      return res.status(404).json({ error: "can not login!", err: err });
    }
  }

  public async deleteUser(req: Request, res: Response, next: NextFunction) {
    const userId = req.params.userId;
    try {
      const user = await User.destroy({ where: { id: userId } });
      return res.status(200).json({ message: "User is Deleted!!", user: user });
    } catch (err) {
      return res.status(404).json({ err: "can not delete any data!!", error: err });
    }
  }
}
