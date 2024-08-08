import { useCallback, useEffect, useState } from "react";
import { filterUndefinedAndNull } from "../../../common/helpers";
import { getAppliedJobs } from "../../../services/candidate";

export const useAppliedJobs = (
  userId,
  pageSize,
  pageIndex,
  search,
  orderBy,
  isDescending,
  filter
) => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const props = {
    userId,
    pageSize,
    pageIndex,
    search,
    orderBy,
    isDescending,
    filter,
  };

  const params = filterUndefinedAndNull({
    pageSize,
    pageIndex,
    search,
    orderBy,
    isDescending,
    ...filter,
  });

  const fetchAppliedJobs = useCallback(async () => {
    if (userId === "") return;
    setLoading(true);
    try {
      const response = await getAppliedJobs(userId, params);

      setAppliedJobs(
        response.data.map((app) => ({
          ...app.job,
          appliedAt: app.appliedAt,
        })) || []
      );
      setPageCount(response.totalPages);
      setTotalRecords(response.totalRecords);
    } catch (error) {
      console.error("Error in fetchUsers:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [userId, pageSize, pageIndex, search, orderBy, isDescending, filter]);

  useEffect(() => {
    fetchAppliedJobs();
  }, [userId, pageSize, pageIndex, search, orderBy, isDescending, filter]);

  return {
    appliedJobs,
    loading,
    error,
    setAppliedJobs,
    pageCount,
    totalRecords,
    fetchAppliedJobs,
  };
};
