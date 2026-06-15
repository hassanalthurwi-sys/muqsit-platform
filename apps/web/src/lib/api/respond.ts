// Sprint 18 — API conventions.
//
// All Muqsit API routes follow the same response shape so the client
// can handle every endpoint uniformly. Once the real DB lands in
// Sprint 19, only the data sources behind these routes change — the
// contract here stays stable.

import { NextResponse } from "next/server";

export interface ApiSuccess<T> {
  ok: true;
  data: T;
  meta?: ApiMeta;
}

export interface ApiError {
  ok: false;
  error: {
    code: ApiErrorCode;
    message: string;
    details?: unknown;
  };
}

export interface ApiMeta {
  total?: number;
  page?: number;
  pageSize?: number;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export type ApiErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "UNPROCESSABLE"
  | "INTERNAL";

const STATUS: Record<ApiErrorCode, number> = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  INTERNAL: 500,
};

export function ok<T>(data: T, meta?: ApiMeta): NextResponse<ApiSuccess<T>> {
  return NextResponse.json({ ok: true, data, meta });
}

export function created<T>(data: T): NextResponse<ApiSuccess<T>> {
  return NextResponse.json({ ok: true, data }, { status: 201 });
}

export function noContent(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

export function fail(
  code: ApiErrorCode,
  message: string,
  details?: unknown,
): NextResponse<ApiError> {
  return NextResponse.json(
    { ok: false, error: { code, message, details } },
    { status: STATUS[code] },
  );
}

export function notFound(entity: string, id: string): NextResponse<ApiError> {
  return fail("NOT_FOUND", `${entity} '${id}' not found`);
}

// Cheap shape validation — replaced by Zod in Sprint 19.
export function requireFields<T extends Record<string, unknown>>(
  body: T,
  fields: (keyof T)[],
): string | null {
  const missing = fields.filter((f) => body[f] == null || body[f] === "");
  if (missing.length > 0) {
    return `missing fields: ${missing.join(", ")}`;
  }
  return null;
}

// Parses query params common to list endpoints. Pagination, search,
// and simple filters.
export interface ListQuery {
  q?: string;
  page: number;
  pageSize: number;
  filter?: string;
}

export function parseListQuery(url: URL): ListQuery {
  return {
    q: url.searchParams.get("q") ?? undefined,
    page: Math.max(1, Number(url.searchParams.get("page") ?? "1")),
    pageSize: Math.min(200, Math.max(1, Number(url.searchParams.get("pageSize") ?? "50"))),
    filter: url.searchParams.get("filter") ?? undefined,
  };
}

export function paginate<T>(
  items: T[],
  { page, pageSize }: ListQuery,
): { rows: T[]; meta: ApiMeta } {
  const total = items.length;
  const start = (page - 1) * pageSize;
  const rows = items.slice(start, start + pageSize);
  return { rows, meta: { total, page, pageSize } };
}
