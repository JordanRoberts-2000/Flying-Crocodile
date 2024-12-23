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

export type AdminCheckResponse = {
  __typename?: 'AdminCheckResponse';
  admin?: Maybe<GitHubUser>;
};

export type CreateEntryInput = {
  isFolder: Scalars['Boolean']['input'];
  parentId?: InputMaybe<Scalars['Int']['input']>;
  rootTitle?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type DeleteEntryInput = {
  entryId?: InputMaybe<Scalars['Int']['input']>;
  rootTitle: Scalars['String']['input'];
};

export type Entry = {
  __typename?: 'Entry';
  id: Scalars['Int']['output'];
  isFolder: Scalars['Boolean']['output'];
  parentId?: Maybe<Scalars['Int']['output']>;
  rootId?: Maybe<Scalars['Int']['output']>;
  title: Scalars['String']['output'];
};

export type GetEntriesInput = {
  folderId?: InputMaybe<Scalars['Int']['input']>;
  rootTitle: Scalars['String']['input'];
};

export type GetEntriesResponse = {
  __typename?: 'GetEntriesResponse';
  entries: Array<MinimalEntry>;
  folderId: Scalars['Int']['output'];
};

export type GitHubUser = {
  __typename?: 'GitHubUser';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  login: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
};

export type MinimalEntry = {
  __typename?: 'MinimalEntry';
  id: Scalars['Int']['output'];
  isFolder: Scalars['Boolean']['output'];
  title: Scalars['String']['output'];
};

export type MoveEntryInput = {
  entryId: Scalars['Int']['input'];
  newParentId: Scalars['Int']['input'];
};

export type RenameEntryInput = {
  entryId?: InputMaybe<Scalars['Int']['input']>;
  newTitle: Scalars['String']['input'];
  rootTitle: Scalars['String']['input'];
};

export type RootMutation = {
  __typename?: 'RootMutation';
  createEntry: Entry;
  deleteEntry: Entry;
  moveEntry: Entry;
  renameEntry: Entry;
};


export type RootMutationCreateEntryArgs = {
  input: CreateEntryInput;
};


export type RootMutationDeleteEntryArgs = {
  input: DeleteEntryInput;
};


export type RootMutationMoveEntryArgs = {
  input: MoveEntryInput;
};


export type RootMutationRenameEntryArgs = {
  input: RenameEntryInput;
};

export type RootQuery = {
  __typename?: 'RootQuery';
  adminCheck: AdminCheckResponse;
  getEntries: GetEntriesResponse;
  getRoots: Array<Scalars['String']['output']>;
};


export type RootQueryGetEntriesArgs = {
  input: GetEntriesInput;
};

export type AdminCheckQueryVariables = Exact<{ [key: string]: never; }>;


export type AdminCheckQuery = { __typename?: 'RootQuery', adminCheck: { __typename?: 'AdminCheckResponse', admin?: { __typename?: 'GitHubUser', login: string, name?: string | null, email?: string | null, avatarUrl?: string | null } | null } };


export const AdminCheckDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AdminCheck"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminCheck"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"admin"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]}}]} as unknown as DocumentNode<AdminCheckQuery, AdminCheckQueryVariables>;