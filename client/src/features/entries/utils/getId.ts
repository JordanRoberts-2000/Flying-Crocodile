import { QueryPath } from "../entryTypes";

function getEntryId(queryPath: QueryPath): number {
  if (queryPath.length <= 1)
    throw new Error("QueryPath array must contain at least one number");

  return queryPath[queryPath.length - 1] as number;
}

export default getEntryId;
