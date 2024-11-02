import { InputMode } from "../entryTypes";
import useEntryStore from "../store";

const useInputIdMatch = (id: number, mode: InputMode["mode"]) => {
  return useEntryStore(
    (state) =>
      state.entryInputMode.id === id && state.entryInputMode.mode === mode
  );
};

export default useInputIdMatch;
