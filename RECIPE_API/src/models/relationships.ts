import Recipe from "./recipe.model";
import Roll from "./roll.model";
import User from "./user.model";

export class Relationships {
  public static define() {
    Roll.hasMany(User);
    User.belongsTo(Roll);

    User.hasMany(Recipe);
    Recipe.belongsTo(User);
  }
}
