import { jwt } from "hono/jwt";
import type { JWTPayload } from "../types.js";
import { env } from "../data/env.js";

export type JWTEnv = {
  Variables: {
    jwtPayload: JWTPayload;
  };
};
export const jwtAuth = jwt({ secret: env.JWT_SECRET, alg: "HS256" });
