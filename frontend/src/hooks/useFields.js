import { useCallback, useEffect, useState } from "react";
import { filterUndefinedAndNull } from "../common/helpers";
import { getFields } from "../services/job";

export const useFields = (
  pageSize,
  pageIndex,
  search,
  orderBy,
  isDescending
) => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  const params = filterUndefinedAndNull({
    pageSize,
    pageIndex,
    search,
    orderBy,
    isDescending,
  });

  const fetchFields = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getFields();

      setFields(
        response.data.map((skill) => ({
          value: skill.id,
          label: skill.name,
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
  }, [pageSize, pageIndex, search, orderBy, isDescending]);

  useEffect(() => {
    fetchFields();
  }, [pageSize, pageIndex, search, orderBy, isDescending]);

  return {
    fields,
    loading,
    error,
    setFields,
    pageCount,
    totalRecords,
    fetchFields,
  };
};
