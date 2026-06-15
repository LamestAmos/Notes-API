import { sValidator } from "@hono/standard-validator";
import { createMiddleware } from "hono/factory";
import z from "zod";

const paginatorQuerySchema = z.object({
  page: z.coerce.number().int().positive().min(1).optional(),
  limit: z.coerce.number().int().positive().min(1).optional(),
});

type PaginationMetaData = {
  next?: { page: number; limit: number };
  previous?: { page: number; limit: number };
};

type PaginationEnv = {
  Variables: {
    paginate: <K extends string, T>(
      key: K,
      data: T[],
      page: number,
      limit: number,
    ) => Record<K, T[]> & PaginationMetaData;
  };
};

const paginatorMiddleware = createMiddleware<PaginationEnv>(
  async (ctx, next) => {
    ctx.set("paginate", (key, data, page, limit) => {
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const results = { [key]: data.slice(startIndex, endIndex) } as Record<
        typeof key,
        typeof data
      > &
        PaginationMetaData;

      if (endIndex < data.length && limit < data.length) {
        results.next = { page: page + 1, limit };
      }

      if (startIndex > 0 && limit < data.length) {
        results.previous = { page: page - 1, limit };
      }

      return results;
    });
    await next();
  },
);

export function paginator() {
  return [
    sValidator("query", paginatorQuerySchema),
    paginatorMiddleware,
  ] as const;
}
