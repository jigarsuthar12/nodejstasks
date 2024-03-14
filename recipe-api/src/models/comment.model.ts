import { DataTypes } from "sequelize";
import sequelize from "../db/database";

const Comment = sequelize.define(
  "Comment",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    flag: {
      type: DataTypes.STRING,
      defaultValue: false,
    },
  },
  { timestamps: true },
);

export default Comment;
