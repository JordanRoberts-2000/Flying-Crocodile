export type InputEntryType = "folder" | "link";

export type ModifyEntry = {
  inputActive: boolean;
  popoverOpen: boolean;
  popoverAnchorRef: React.MutableRefObject<HTMLElement | null> | undefined;
};

export type QueryPath = [string, number?, ...number[]];
