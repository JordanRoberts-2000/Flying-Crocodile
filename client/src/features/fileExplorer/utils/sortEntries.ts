import { Entry } from "@/gql/graphql";

function sortEntries(data: Entry[]) {
  const sortedGalleryItems = data.sort((a, b) => {
    if (a.isFolder && !b.isFolder) return -1;
    if (!a.isFolder && b.isFolder) return 1;
    return a.title.localeCompare(b.title);
  });
  return sortedGalleryItems;
}

export default sortEntries;
