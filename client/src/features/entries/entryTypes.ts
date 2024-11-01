type InputModes = "add" | "edit";

type EntryTypes = "folder" | "link";

export type InputMode = {
  id: number | null;
  mode: InputModes;
  entryType: EntryTypes;
};
