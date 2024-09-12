import { useEffect, useState } from "react";
import { JOB_TYPES } from "../../../../common/constant";
import { LoadingSpinner } from "../../../../components/LoadingSpinner";
import { Pagination } from "../../../../components/Pagination";
import { SearchForm } from "../../../../components/SearchForm";
import { Select } from "../../../../components/Select";
import { useAuth } from "../../../../hooks";
import { useFields } from "../../../../hooks/useFields";
import { useLoading } from "../../../../hooks/useLoading";
import { JobCard } from "../../components/Jobs";
import { useAppliedJobs } from "../../hooks/useAppliedJobs";

export const AppliedJobs = () => {
  const { user } = useAuth();
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageCount: 0,
    pageSize: 10,
    totalRecords: 0,
  });
  const [filter, setFilter] = useState({
    field: null,
    type: null,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const { appliedJobs, fetchAppliedJobs, pageCount, totalRecords, loading } =
    useAppliedJobs(
      user.id,
      pagination.pageSize,
      pagination.pageIndex,
      searchQuery,
      sortConfig.key,
      sortConfig === "descending",
      filter
    );
  const { isLoading, setIsLoading } = useLoading();
  const { fields } = useFields();

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      pageCount,
      totalRecords,
    }));
  }, [pageCount, totalRecords]);

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 flex-wrap">
        <SearchForm setSearch={setSearchQuery} onSubmit={fetchAppliedJobs} />
        <Select
          options={fields}
          search={true}
          label={"Field"}
          onChange={(option) => {
            setFilter((prev) => ({
              ...prev,
              field: option?.value,
            }));
          }}
          className={"sm:w-[30%]"}
        />
        <Select
          options={JOB_TYPES}
          label={"Type"}
          onChange={(option) => {
            setFilter((prev) => ({
              ...prev,
              type: option?.value,
            }));
          }}
          className={"w-[30%]"}
        />
      </div>
      <div className="mt-4">
        {isLoading || loading ? (
          <LoadingSpinner />
        ) : appliedJobs.length > 0 ? (
          <>
            <div className="flex gap-2 flex-wrap justify-between">
              {appliedJobs.map((job, index) => (
                <JobCard
                  job={job}
                  key={index}
                  onApplyClick={() => {
                    setJobId(job.id);
                    setOpenApplyJob(true);
                  }}
                  applyDisabled={appliedJobs.find(
                    (appliedJob) => appliedJob.id === job.id
                  )}
                />
              ))}
            </div>
            <Pagination
              {...pagination}
              setPage={(page) => {
                setPagination({ ...pagination, pageIndex: page });
              }}
            />
          </>
        ) : (
          <div className="text-center w-full text-xl">No result</div>
        )}
      </div>
    </div>
  );
};
