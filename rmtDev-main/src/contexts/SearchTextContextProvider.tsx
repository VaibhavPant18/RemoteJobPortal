import { createContext, useState } from "react";
import { useDebounce } from "../lib/hooks";
type SearchTextContext = {
  searchText: string;
  debouncedSearchText: string;
  handleSearchTextChange: (newSearchText:string) => void;
};
export const SearchTextContext = createContext<SearchTextContext | null>(null);
export default function SearchTextContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText, 250);

  const handleSearchTextChange = (newSearchText:string) => {
    setSearchText(newSearchText);
  };

  return (
    <SearchTextContext.Provider
      value={{
        searchText,
        debouncedSearchText,
        handleSearchTextChange,
      }}
    >
      {children}
    </SearchTextContext.Provider>
  );
}
