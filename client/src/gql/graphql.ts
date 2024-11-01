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

export type RootMutation = {
  __typename?: 'RootMutation';
  createEntry: Entry;
};


export type RootMutationCreateEntryArgs = {
  newEntry: NewEntry;
};

export type RootQuery = {
  __typename?: 'RootQuery';
  getEntries: Array<Entry>;
};

export type GetEntriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetEntriesQuery = { __typename?: 'RootQuery', getEntries: Array<{ __typename?: 'Entry', id: number, title: string, isFolder: boolean }> };

export type CreateEntryMutationVariables = Exact<{
  newEntry: NewEntry;
}>;


export type CreateEntryMutation = { __typename?: 'RootMutation', createEntry: { __typename?: 'Entry', parentId?: number | null, title: string, isFolder: boolean } };


export const GetEntriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"isFolder"}}]}}]}}]} as unknown as DocumentNode<GetEntriesQuery, GetEntriesQueryVariables>;
export const CreateEntryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateEntry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newEntry"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NewEntry"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createEntry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"newEntry"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newEntry"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"isFolder"}}]}}]}}]} as unknown as DocumentNode<CreateEntryMutation, CreateEntryMutationVariables>;