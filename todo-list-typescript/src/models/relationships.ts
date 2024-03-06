import Task from "./task.model";
import User from "./user.model";

export class Relationships {
  public static define() {
    User.hasMany(Task);
    Task.belongsTo(User);
  }
}
