import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { JOB_TYPES } from "../../../common/constant";
import { filterUndefinedAndNull } from "../../../common/helpers";
import { Dialog } from "../../../components/Dialog";
import { LoadingSpinner } from "../../../components/LoadingSpinner";
import { Pagination } from "../../../components/Pagination";
import { SearchForm } from "../../../components/SearchForm";
import { Select } from "../../../components/Select";
import { useAuth } from "../../../hooks";
import { useFields } from "../../../hooks/useFields";
import { useLoading } from "../../../hooks/useLoading";
import { getPagedJobs } from "../../../services/job";
import { ApplyJob, JobCard } from "../components/Jobs";
import { useAppliedJobs } from "../hooks/useAppliedJobs";

const DashBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageCount: 0,
    pageSize: 10,
    totalRecords: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const { isLoading, setIsLoading } = useLoading();
  const { user, isAuthenticated } = useAuth();
  const [jobId, setJobId] = useState();
  const [openApplyJob, setOpenApplyJob] = useState(false);
  const { appliedJobs, fetchAppliedJobs } = useAppliedJobs(user.id, 1000000);
  const { fields, fetchFields } = useFields();
  const [filter, setFilter] = useState({
    field: null,
    type: null,
  });
  const navigate = useNavigate();

  console.log(appliedJobs);
  

  const fetchJobs = async () => {
    setIsLoading(true);
    await getPagedJobs({
      PageIndex: pagination.pageIndex,
      PageSize: pagination.pageSize,
      search: searchQuery,
      orderBy: sortConfig.key,
      isDescending: sortConfig.direction === "descending",
      ...filterUndefinedAndNull(filter),
    })
      .then((response) => {
        setJobs(response.data || []);
        setPagination({
          ...pagination,
          pageCount: response.totalPages,
          totalRecords: response.totalRecords,
        });
      })
      .catch((err) => {
        toast.error("Trouble fetching jobs");
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchJobs();
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    filter,
    searchQuery,
    sortConfig,
  ]);

  return (
    <div className="p-8">
      <div className="flex items-center gap-4">
        <SearchForm
          setSearch={(query) => {
            setSearchQuery(query);
            setPagination({ ...pagination, pageIndex: 1 });
          }}
          onSubmit={fetchJobs}
        />
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
          className={"w-[30%]"}
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
        {isLoading ? (
          <LoadingSpinner />
        ) : jobs.length > 0 ? (
          <>
            <div className="flex gap-2 flex-wrap justify-between">
              {jobs.map((job, index) => (
                <JobCard
                  job={job}
                  key={index}
                  onApplyClick={() => {
                    if (!isAuthenticated || user.type !== "candidate") {
                      toast.info("Please signin to continue");
                      navigate("/signin/candidates");
                      return;
                    }
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
      <Dialog open={openApplyJob} setOpen={setOpenApplyJob}>
        <ApplyJob
          jobId={jobId}
          candidateId={user.id}
          onSubmit={() => {
            setOpenApplyJob(false);
            fetchAppliedJobs();
          }}
        />
      </Dialog>
    </div>
  );
};

export default DashBoard;
