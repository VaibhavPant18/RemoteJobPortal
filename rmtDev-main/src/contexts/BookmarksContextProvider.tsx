import { createContext } from "react";
import { useJobItems, useLocalStorage } from "../lib/hooks";
import { jobItemExpanded } from "../lib/types";

type BookmarksContext = {
  bookmarkedIds: number[];
  handleBookmarkToggle: (id: number) => void;
  bookmarkedJobItems:jobItemExpanded[];
  isLoading:boolean
};
export const BookmarksContext = createContext<BookmarksContext | null>(null);

export default function BookmarksContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [bookmarkedIds, setBookmarkedIds] = useLocalStorage<number[]>(
    "bookmarkIds",
    []
  );

  const {jobItems:bookmarkedJobItems,isLoading} = useJobItems(bookmarkedIds)

  const handleBookmarkToggle = (id: number) => {
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds((prev) => prev.filter((item) => item !== id));
    } else {
      setBookmarkedIds((prev) => [...prev, id]);
    }
  };

  return (
    <BookmarksContext.Provider
      value={{
        bookmarkedIds,
        handleBookmarkToggle,
        bookmarkedJobItems,
        isLoading
      }}
    >
      {children}
    </BookmarksContext.Provider>
  );
}


