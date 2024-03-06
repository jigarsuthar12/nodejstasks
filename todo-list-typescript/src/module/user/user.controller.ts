import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import { Jwt } from "../../helper/jwt.helper";
import User from "../../models/user.model";

export class UserController {
  public async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await User.findAll();
      return res.status(200).json({ message: "all users", users: users });
    } catch (err) {
      return res.status(404).json({ message: "cannot get any users" });
    }
  }

  public async postUser(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body;
    try {
      const hasedpw = await bcrypt.hash(password, 12);
      const user = await User.create({ name: username, password: hasedpw });
      return res.status(201).json({ message: "user is created!!", user: user });
    } catch (err) {
      return res.status(404).json({ message: "Error in creating user" });
    }
  }

  public async updateUser(req: Request, res: Response, next: NextFunction) {
    const id = req.params.userId;
    const updated_password = req.body.password;
    const updated_name = req.body.name;
    try {
      const hasedpw = await bcrypt.hash(updated_password, 12);
      const data = await User.update(
        {
          name: updated_name,
          password: hasedpw,
        },
        {
          where: {
            id: id,
          },
        },
      );
      return res.status(200).json({ message: "user is updated", data: data });
    } catch (err) {
      res.status(404).json({ messsage: "Error in Updating data" });
    }
  }

  public async loginUser(req: Request, res: Response, next: NextFunction) {
    const { name, password } = req.body;

    try {
      const user = (await User.findOne({ where: { name: name } })) as any;
      if (!user) {
        return res.status(400).json({ error: "Please check your name" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({ error: "Please check your password!" });
      }
      const token = Jwt.encode({ id: user.id });
      res.status(200).json({ message: "user Found", token: token });
    } catch (err) {
      res.status(404).json({ message: "cannot find any user" });
    }
  }

  public async deleteUser(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.params;
    try {
      const data = await User.destroy({
        where: {
          id: userId,
        },
      });
      return res.status(200).json({ message: "user is deleted", data: data });
    } catch (err) {
      return res.status(404).json({ message: "cannot find a user with this user id!" });
    }
  }
}
