import bodyParser from "body-parser";
import express from "express";
import sequelize from "./db/database";
import { Relationships } from "./models/relationships";
import { Routes } from "./routes";

export class App {
  protected app: express.Application;

  constructor() {
    this.app = express();
    this.app.use(bodyParser.json());
    const routes = new Routes();
    this.app.use("/", routes.configure());
    Relationships.define();
    sequelize
      .sync({ force: false })
      .then(res => {
        this.app.listen(3000);
      })
      .catch(err => console.error(err));
  }
}
