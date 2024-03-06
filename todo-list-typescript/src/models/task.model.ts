import { DataTypes } from "sequelize";
import sequelize from "../db/database";

const Task = sequelize.define("task", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  desc: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Task;
