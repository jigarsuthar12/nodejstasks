import Comment from "./comment.model";
import Follower from "./follower.model";
import Ingredient from "./ingredient.model";
import Like from "./like.model";
import Recipe from "./recipe.model";
import Roll from "./roll.model";
import User from "./user.model";

export class Relationships {
  public static define() {
    Roll.hasMany(User);
    User.belongsTo(Roll);

    User.hasMany(Recipe);
    Recipe.belongsTo(User);

    Recipe.hasMany(Ingredient, { onDelete: "cascade" });
    Ingredient.belongsTo(Recipe);
    Ingredient.belongsTo(User);

    Follower.belongsTo(User);
    Follower.belongsTo(User, { foreignKey: "FollowedId" });

    Follower.hasMany(Recipe, { foreignKey: "RecipeId" });

    Recipe.hasMany(Comment);
    Comment.belongsTo(Recipe);
    Comment.belongsTo(User, { foreignKey: "commentatorId" });
    Comment.belongsTo(User, { foreignKey: "commentId" });

    Like.belongsTo(User);
    Like.belongsTo(Recipe);
  }
}
