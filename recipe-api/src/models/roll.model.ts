import { DataTypes } from "sequelize";
import sequelize from "../db/database";

const Roll = sequelize.define(
  "Roll",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: true },
);

export default Roll;
