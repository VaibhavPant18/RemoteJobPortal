import { useJobItemsContext } from "../lib/hooks";
import JobList from "./JobList";

export default function JobListSearch() {
  const { jobItemsSortedandSliced, isLoading } = useJobItemsContext();
  return <JobList jobItems={jobItemsSortedandSliced} isLoading={isLoading} />;
}
