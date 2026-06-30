import type { Context } from "hono";
import type { JWTPayload } from "../types.js";

export const getUserID = (ctx: Context): string => {
  const payload = ctx.get("jwtPayload") as JWTPayload;
  return payload.sub;
};
