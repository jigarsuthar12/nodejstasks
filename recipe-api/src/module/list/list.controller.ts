import { NextFunction, Request, Response } from "express";
import Recipe from "../../models/recipe.model";

export class ListController {
  public async getOwnList(req: Request, res: Response, next: NextFunction) {
    const id = req.body.decoded.id;
    try {
      const recipes = await Recipe.findAll({ where: { UserId: id, hide_flag: 0, deleted_flag: 0 } });
      if (recipes) {
        return res.status(200).json({ message: "your recipes are", recipe: recipes });
      } else {
        return res.status(404).json({ message: "can not find any recipes!!" });
      }
    } catch (err) {
      return res.status(404).json({ error: "error in finding in list" });
    }
  }
  public async getRecipeByTagOrName(req: Request, res: Response, next: NextFunction) {
    const id = req.body.decoded.id;
    const tagname = req.query.tag;
    const name = req.query.recipename;

    if (tagname) {
      const recipe = await Recipe.findAll({ where: { tag: tagname, hide_flag: 0, deleted_flag: 0 } });
      if (recipe) {
        return res.status(200).json({ message: "got all your recipes!", recipe: recipe });
      } else {
        return res.status(404).json({ message: "can not get any recipe by this tag" });
      }
    } else if (name) {
      const recipe = await Recipe.findAll({ where: { name: name, hide_flag: 0, deleted_flag: 0 } });
      if (recipe) {
        return res.status(200).json({ message: "got all your recipes!", recipe: recipe });
      } else {
        return res.status(404).json({ message: "can not get any recipe by this tag" });
      }
    }
  }
}
