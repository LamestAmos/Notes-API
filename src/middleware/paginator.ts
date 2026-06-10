import { sValidator } from "@hono/standard-validator";
import { createMiddleware } from "hono/factory";
import z from "zod";

const paginatorQuerySchema = z.object({
  page: z.coerce.number().int().positive().min(1).optional(),
  limit: z.coerce.number().int().positive().min(1).optional(),
});

const paginatorMiddleware = createMiddleware<{
  Variables: {
    paginate: <T>(
      data: T[],
      page: number,
      limit: number,
    ) => {
      data: T[];
      next?: { page: number; limit: number };
      previous?: { page: number; limit: number };
    };
  };
}>(async (ctx, next) => {
  ctx.set("paginate", (data, page, limit) => {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results: {
      data: typeof data;
      next?: { page: number; limit: number };
      previous?: { page: number; limit: number };
    } = { data: data.slice(startIndex, endIndex) };

    if (endIndex < data.length && limit < data.length) {
      results.next = { page: page + 1, limit };
    }

    if (startIndex > 0 && limit < data.length) {
      results.previous = { page: page - 1, limit };
    }

    return results;
  });
  await next();
});

export function paginator() {
  return [
    sValidator("query", paginatorQuerySchema),
    paginatorMiddleware,
  ] as const;
}
