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
    forked_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  { timestamps: true },
);

export default Recipe;
