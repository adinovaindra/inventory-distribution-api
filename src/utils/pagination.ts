import z from "zod";

export const paginationSchema = z.object({
  cursor: z
    .string()
    .trim()
    .transform((value) => {
      return Number(value);
    })
    .pipe(z.number().int().min(1))
    .optional(),
  limit: z
    .string()
    .trim()
    .default("10")
    .transform((value) => {
      return Number(value);
    })
    .pipe(z.number().int().min(1).max(100)),
});

export interface PaginationQuery {
  take: number;
  orderBy: {
    id: "asc";
  };
  cursor?: {
    id: number;
  };
  skip?: number;
}

export function buildPaginationQuery(cursor: number | undefined, limit: number): PaginationQuery {
  const query: PaginationQuery = {
    take: limit + 1,
    orderBy: {
      id: "asc",
    },
  };

  if (cursor) {
    query.cursor = {
      id: cursor,
    };
    query.skip = 1;
  }

  return query;
}

export interface PaginationMeta {
  nextCursor: number | null;
  limit: number;
  hasMore: boolean;
}

export function buildPaginationMeta(data: { id: number }[], limit: number): PaginationMeta {
  let hasMore: boolean = false;

  if (data.length > limit) {
    hasMore = true;
    data.pop();
  }

  return {
    nextCursor: hasMore ? data[data.length - 1].id : null,
    limit,
    hasMore,
  };
}
