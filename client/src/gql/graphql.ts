/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Entry = {
  __typename?: 'Entry';
  id: Scalars['Int']['output'];
  isFolder: Scalars['Boolean']['output'];
  parentId?: Maybe<Scalars['Int']['output']>;
  title: Scalars['String']['output'];
};

export type NewEntry = {
  isFolder: Scalars['Boolean']['input'];
  parentId?: InputMaybe<Scalars['Int']['input']>;
  title: Scalars['String']['input'];
};

export type RootEntry = {
  __typename?: 'RootEntry';
  entries: Array<Entry>;
  rootId: Scalars['Int']['output'];
};

export type RootMutation = {
  __typename?: 'RootMutation';
  createEntry: Entry;
  deleteEntry: Entry;
  updateEntry: Entry;
};


export type RootMutationCreateEntryArgs = {
  newEntry: NewEntry;
};


export type RootMutationDeleteEntryArgs = {
  entryId: Scalars['Int']['input'];
};


export type RootMutationUpdateEntryArgs = {
  entryId: Scalars['Int']['input'];
  newTitle: Scalars['String']['input'];
};

export type RootQuery = {
  __typename?: 'RootQuery';
  getEntries: Array<Entry>;
  getRootEntries: RootEntry;
};


export type RootQueryGetEntriesArgs = {
  parentId?: InputMaybe<Scalars['Int']['input']>;
};


export type RootQueryGetRootEntriesArgs = {
  title: Scalars['String']['input'];
};

export type GetRootEntryQueryVariables = Exact<{
  title: Scalars['String']['input'];
}>;


export type GetRootEntryQuery = { __typename?: 'RootQuery', getRootEntries: { __typename?: 'RootEntry', rootId: number, entries: Array<{ __typename?: 'Entry', id: number, title: string, isFolder: boolean }> } };

export type GetEntriesQueryVariables = Exact<{
  parentId?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetEntriesQuery = { __typename?: 'RootQuery', getEntries: Array<{ __typename?: 'Entry', id: number, title: string, isFolder: boolean }> };

export type CreateEntryMutationVariables = Exact<{
  newEntry: NewEntry;
}>;


export type CreateEntryMutation = { __typename?: 'RootMutation', createEntry: { __typename?: 'Entry', parentId?: number | null, title: string, isFolder: boolean } };

export type DeleteEntryMutationVariables = Exact<{
  entryId: Scalars['Int']['input'];
}>;


export type DeleteEntryMutation = { __typename?: 'RootMutation', deleteEntry: { __typename?: 'Entry', id: number } };

export type UpdateEntryMutationVariables = Exact<{
  entryId: Scalars['Int']['input'];
  newTitle: Scalars['String']['input'];
}>;


export type UpdateEntryMutation = { __typename?: 'RootMutation', updateEntry: { __typename?: 'Entry', id: number, title: string } };


export const GetRootEntryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRootEntry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getRootEntries"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"title"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rootId"}},{"kind":"Field","name":{"kind":"Name","value":"entries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"isFolder"}}]}}]}}]}}]} as unknown as DocumentNode<GetRootEntryQuery, GetRootEntryQueryVariables>;
export const GetEntriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEntries"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getEntries"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"parentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"isFolder"}}]}}]}}]} as unknown as DocumentNode<GetEntriesQuery, GetEntriesQueryVariables>;
export const CreateEntryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateEntry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newEntry"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NewEntry"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createEntry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"newEntry"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newEntry"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"isFolder"}}]}}]}}]} as unknown as DocumentNode<CreateEntryMutation, CreateEntryMutationVariables>;
export const DeleteEntryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteEntry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entryId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteEntry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"entryId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entryId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteEntryMutation, DeleteEntryMutationVariables>;
export const UpdateEntryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateEntry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entryId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newTitle"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateEntry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"entryId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entryId"}}},{"kind":"Argument","name":{"kind":"Name","value":"newTitle"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newTitle"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]} as unknown as DocumentNode<UpdateEntryMutation, UpdateEntryMutationVariables>;