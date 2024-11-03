import { QueryPath } from "../entryTypes";

function getEntryId(queryPath: QueryPath, getParent?: "parent"): number {
  if (queryPath.length <= 1)
    throw new Error("QueryPath array must contain at least one number");

  if (getParent) {
    if (queryPath.length <= 2)
      throw new Error(
        "QueryPath array must contain at least two numbers when retrieving parentId"
      );
    return queryPath[queryPath.length - 2] as number;
  }

  return queryPath[queryPath.length - 1] as number;
}

export default getEntryId;
