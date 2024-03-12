import { DataTypes } from "sequelize";
import sequelize from "../db/database";

const Recipe = sequelize.define(
  "Recipe",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: {
      type: DataTypes.STRING,
    },
    ingredient: {
      type: DataTypes.JSON,
    },
    type: {
      type: DataTypes.ENUM("own", "forked"),
      allowNull: false,
    },
    tag: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    forked_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    deleted_flag: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    hide_flag: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  { timestamps: true },
);

export default Recipe;
