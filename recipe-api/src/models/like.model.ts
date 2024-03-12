import { DataTypes } from "sequelize";
import sequelize from "../db/database";

const Like = sequelize.define("Like", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
});

export default Like;
