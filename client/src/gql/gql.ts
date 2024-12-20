/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
const documents = {
    "\n  query GetRootEntry($title: String!) {\n    getRootEntries(title: $title) {\n      rootId\n      entries {\n        id\n        title\n        isFolder\n        parentId\n      }\n    }\n  }\n": types.GetRootEntryDocument,
    "\n  query GetEntries($parentId: Int) {\n    getEntries(parentId: $parentId) {\n      id\n      title\n      isFolder\n      parentId\n    }\n  }\n": types.GetEntriesDocument,
    "\n  mutation CreateEntry($newEntry: NewEntry!) {\n    createEntry(newEntry: $newEntry) {\n      parentId\n      title\n      isFolder\n    }\n  }\n": types.CreateEntryDocument,
    "\n  mutation DeleteEntry($entryId: Int!) {\n    deleteEntry(entryId: $entryId) {\n      id\n    }\n  }\n": types.DeleteEntryDocument,
    "\n  mutation UpdateEntry($entryId: Int!, $newTitle: String!) {\n    updateEntry(entryId: $entryId, newTitle: $newTitle) {\n      id\n      title\n    }\n  }\n": types.UpdateEntryDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetRootEntry($title: String!) {\n    getRootEntries(title: $title) {\n      rootId\n      entries {\n        id\n        title\n        isFolder\n        parentId\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetRootEntry($title: String!) {\n    getRootEntries(title: $title) {\n      rootId\n      entries {\n        id\n        title\n        isFolder\n        parentId\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetEntries($parentId: Int) {\n    getEntries(parentId: $parentId) {\n      id\n      title\n      isFolder\n      parentId\n    }\n  }\n"): (typeof documents)["\n  query GetEntries($parentId: Int) {\n    getEntries(parentId: $parentId) {\n      id\n      title\n      isFolder\n      parentId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateEntry($newEntry: NewEntry!) {\n    createEntry(newEntry: $newEntry) {\n      parentId\n      title\n      isFolder\n    }\n  }\n"): (typeof documents)["\n  mutation CreateEntry($newEntry: NewEntry!) {\n    createEntry(newEntry: $newEntry) {\n      parentId\n      title\n      isFolder\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteEntry($entryId: Int!) {\n    deleteEntry(entryId: $entryId) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteEntry($entryId: Int!) {\n    deleteEntry(entryId: $entryId) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateEntry($entryId: Int!, $newTitle: String!) {\n    updateEntry(entryId: $entryId, newTitle: $newTitle) {\n      id\n      title\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateEntry($entryId: Int!, $newTitle: String!) {\n    updateEntry(entryId: $entryId, newTitle: $newTitle) {\n      id\n      title\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;