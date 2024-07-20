import { createContext, useCallback, useMemo, useState } from "react";
import { RESULTS_PER_PAGE } from "../lib/constants";
import { useSearchQuery, useSearchTextContext } from "../lib/hooks";
import { SortBy, PageDirection, jobItem } from "../lib/types";

type JobItemsContext = {
  jobItems: jobItem[] | undefined;
  isLoading: boolean;
  totalNumberOfResults: number;
  totalNumberOfPages: number;
  sortBy: SortBy;
  currentPage: number;
  jobItemsSorted: jobItem[];
  jobItemsSortedandSliced: jobItem[];
  handleChangePage: (direction: PageDirection) => void;
  handleChangeSortBy: (newSortBy: SortBy) => void;
};
export const JobItemsContext = createContext<JobItemsContext | null>(null);

export default function JobItemsContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  //dependency of other contexts
  const { debouncedSearchText } = useSearchTextContext();
  //states & custom hooks
  const { jobItems, isLoading } = useSearchQuery(debouncedSearchText);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSorteBy] = useState<SortBy>("relevance");
  //computed states

  const totalNumberOfResults = jobItems?.length ?? 0;
  const totalNumberOfPages = totalNumberOfResults / RESULTS_PER_PAGE;
  const jobItemsSorted = useMemo(
    () =>
      [...(jobItems ?? [])]?.sort((a, b) => {
        if (sortBy === "relevance") {
          return b.relevanceScore - a.relevanceScore;
        } else {
          return a.daysAgo - b.daysAgo;
        }
      }),
    [jobItems, sortBy]
  );

  const jobItemsSortedandSliced = useMemo(
    () =>
      jobItemsSorted.slice(
        (currentPage - 1) * RESULTS_PER_PAGE,
        currentPage * RESULTS_PER_PAGE
      ),
    [jobItemsSorted, currentPage]
  );
  const handleChangePage = useCallback((direction: PageDirection) => {
    if (direction === "previous") {
      setCurrentPage((prev) => prev - 1);
    } else if (direction === "next") {
      setCurrentPage((prev) => prev + 1);
    }
  }, []);

  const handleChangeSortBy = useCallback((newSortBy: SortBy) => {
    setCurrentPage(1);
    setSorteBy(newSortBy);
  },[]);

  const ContextValue = useMemo(
    () => ({
      jobItems,
      isLoading,
      totalNumberOfResults,
      totalNumberOfPages,
      sortBy,
      currentPage,
      jobItemsSorted,
      jobItemsSortedandSliced,
      handleChangePage,
      handleChangeSortBy,
    }),
    [
      jobItems,
      isLoading,
      totalNumberOfResults,
      totalNumberOfPages,
      sortBy,
      currentPage,
      jobItemsSorted,
      jobItemsSortedandSliced,
      handleChangePage,
      handleChangeSortBy,
    ]
  );

  return (
    <JobItemsContext.Provider value={ContextValue}>
      {children}
    </JobItemsContext.Provider>
  );
}
