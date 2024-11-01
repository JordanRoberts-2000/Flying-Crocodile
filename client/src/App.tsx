import AppSidebar from "./components/AppSidebar";
import { Sheet, SheetTrigger } from "./components/ui/sheet";
import { graphql } from "./gql";
import useSideBarStore from "./sidebarStore";
import request from "graphql-request";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  GetEntriesQuery,
  CreateEntryMutation,
  CreateEntryMutationVariables,
} from "./gql/graphql";

const entryQuery = graphql(/* GraphQl */ `
  query GetEntries {
    getEntries {
      id
      title
      parentid
    }
  }
`);

const create_entry = graphql(`
  mutation CreateEntry($newEntry: NewEntry!) {
    createEntry(newEntry: $newEntry) {
      id
      title
      parentid
    }
  }
`);

function App() {
  const { data, isLoading } = useQuery<GetEntriesQuery>({
    queryKey: ["entries"],
    queryFn: async () => request("http://localhost:3000/graphql", entryQuery),
  });
  const mutation = useMutation<
    CreateEntryMutation,
    Error,
    CreateEntryMutationVariables
  >({
    mutationFn: async (variables) => {
      return request("http://localhost:3000/graphql", create_entry, variables);
    },
  });
  const handleCreate = () => {
    mutation.mutate({
      newEntry: {
        title: "this is mutation test",
        parentid: 1,
      },
    });
  };
  console.log(isLoading, data);
  return (
    <div>
      <button
        className="p-2 m-4 bg-purple-800 text-white"
        onClick={() => handleCreate()}
      >
        Add
      </button>
      <header>
        <Sheet
          onOpenChange={() =>
            useSideBarStore.setState(() => ({ addCategoryMode: false }))
          }
        >
          <SheetTrigger asChild>
            <button>Open</button>
          </SheetTrigger>
          <AppSidebar />
        </Sheet>
      </header>
      new project
    </div>
  );
}

export default App;
