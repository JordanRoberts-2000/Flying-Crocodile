import { QueryPath } from "../entryTypes";

export function getEntryId(queryPath: QueryPath): number {
  if (queryPath.length <= 1) throw new Error("QueryPath Invalid");

  return queryPath[queryPath.length - 1] as number;
}

export function getEntryParentId(queryPath: QueryPath): number | null {
  if (queryPath.length <= 1) throw new Error("QueryPath Invalid");

  if (typeof queryPath[queryPath.length - 2] === "string") return null;
  return queryPath[queryPath.length - 2] as number;
}
