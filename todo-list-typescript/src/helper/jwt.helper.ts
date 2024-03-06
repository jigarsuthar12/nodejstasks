import * as jwt from "jsonwebtoken";

export class Jwt {
  public static encode(data) {
    return jwt.sign(data, process.env.JWT_SECRET);
  }

  public static decode(token) {
    if (token) {
      try {
        return jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        return false;
      }
    }
    return false;
  }
}
