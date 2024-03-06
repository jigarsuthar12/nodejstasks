import { NextFunction, Request, Response } from "express";
import Task from "../../models/task.model";

export class TaskController {
  public async getAllTasks(req: Request, res: Response, next: NextFunction) {
    try {
      const tasks = await Task.findAll({
        where: {
          UserId: req.body.decoded.id,
        },
      });
      return res.status(200).json({ message: "All Task", tasks: tasks });
    } catch (err) {
      return res.status(404).json({ message: "can not get task", tasks: err });
    }
  }

  public async createTask(req: Request, res: Response, next: NextFunction) {
    const { desc } = req.body;
    try {
      const tasks = await Task.create({
        desc: desc,
        UserId: req.body.decoded.id,
      });
      return res.status(201).json({ message: "Task is created !", task: tasks });
    } catch (err) {
      return res.status(404).json({ message: "Something went wrong can not create task !", task: err });
    }
  }
  public async updateTask(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { desc } = req.body;

    try {
      const user = await Task.findAll({ where: { UserId: req.body.decoded.id } });
      if (!user) {
        return res.status(404).json({ message: "user is not authorized!!" });
      }
      const task = await Task.update(
        {
          desc: desc,
        },
        {
          where: {
            UserId: req.body.decoded.id,
            id: id,
          },
        },
      );
      if (task[0] === 0) {
        return res.status(404).json({ messsage: "Task is not updated user is not authorized!!" });
      } else {
        return res.status(200).json({ messsage: "Task updated!", task: task });
      }
    } catch (err) {
      return res.status(404).json({ messsage: "Can not Update Task!", task: err });
    }
  }

  public async deleteTask(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const user = await Task.findAll({ where: { UserId: req.body.decoded.id } });
    if (!user) {
      return res.status(404).json({ message: "User is not authorized" });
    }
    try {
      const data = await Task.destroy({
        where: {
          UserId: req.body.decoded.id,
          id: id,
        },
      });
      if (data === 0) {
        return res.status(404).json({ message: "can not delete task user iss not authorized!" });
      } else {
        return res.status(200).json({ message: "Task is deleted!!", deletedTask: data });
      }
    } catch (err) {
      return res.status(401).json({ message: "Task is not deleted something went wrong!!", deletedTask: err });
    }
  }
}
