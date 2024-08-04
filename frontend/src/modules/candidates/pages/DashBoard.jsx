import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Dialog } from "../../../components/Dialog";
import { LoadingSpinner } from "../../../components/LoadingSpinner";
import { useAuth } from "../../../hooks";
import { useLoading } from "../../../hooks/useLoading";
import { getAppliedJobs } from "../../../services/candidate";
import { getPagedJobs } from "../../../services/job";
import { ApplyJob, JobCard } from "../components/Jobs";

const DashBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageCount: 0,
    pageSize: 10,
    totalRecords: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const { isLoading, setIsLoading } = useLoading();
  const { user } = useAuth();
  const [jobId, setJobId] = useState();
  const [openApplyJob, setOpenApplyJob] = useState(false);

  const fetchJobs = async () => {
    setIsLoading(true);
    await getPagedJobs({
      PageIndex: pagination.pageIndex,
      PageSize: pagination.pageSize,
      search: searchQuery,
      orderBy: sortConfig.key,
      isDescending: sortConfig.direction === "descending",
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

  const fetchAppliedJobs = async () => {
    if (user.id === "") return;
    setIsLoading(true);
    await getAppliedJobs(user.id, {pageSize:1000000}).then(response => {
      setAppliedJobs(response.data.map((app)=>(app.job)));
    }).catch(err=>{
      toast.error("Trouble fetching applied jobs");
      console.log(err);
    }).finally(()=>{
      setIsLoading(false);
    })
  }

  useEffect(() => {
    fetchJobs();
  }, [pagination.pageIndex, pagination.pageSize, searchQuery, sortConfig]);

  useEffect(() => {
    fetchAppliedJobs();
  }, [user]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="p-8">
      <div className="flex gap-2 flex-wrap justify-between">
        {jobs.map((job, index) => (
          <JobCard job={job} key={index} onApplyClick={() => {
            setJobId(job.id);
            setOpenApplyJob(true);
          }} 
            applyDisabled={appliedJobs.find(appliedJob => appliedJob.id === job.id)}
          />
        ))}
      </div>
      <Dialog open={openApplyJob} setOpen={setOpenApplyJob}>
        <ApplyJob jobId={jobId} candidateId={user.id} onSubmit={()=>{setOpenApplyJob(false); fetchAppliedJobs()}}/>
      </Dialog>
    </div>
  );
};

export default DashBoard;
