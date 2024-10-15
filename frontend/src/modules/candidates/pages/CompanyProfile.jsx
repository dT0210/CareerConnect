import { useEffect, useState } from "react";
import { BsBuildingsFill } from "react-icons/bs";
import { FaGlobe } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Dialog } from "../../../components/Dialog";
import { LoadingSpinner } from "../../../components/LoadingSpinner";
import { Pagination } from "../../../components/Pagination";
import { SearchForm } from "../../../components/SearchForm";
import { useAuth } from "../../../hooks";
import { getCompanyProfile } from "../../../services/company";
import { getPagedJobs } from "../../../services/job";
import { ApplyJob } from "../components/Jobs";
import { JobCard } from "../components/Jobs/JobCard";
import { useAppliedJobs } from "../hooks/useAppliedJobs";

function CompanyProfile() {
  const { companyId } = useParams();
  const [company, setCompany] = useState();
  const [jobs, setJobs] = useState();
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageCount: 0,
    pageSize: 10,
    totalRecords: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const { user, isAuthenticated } = useAuth();
  const [jobId, setJobId] = useState();
  const [openApplyJob, setOpenApplyJob] = useState(false);
  const { appliedJobs, fetchAppliedJobs } = useAppliedJobs(user.id, 1000000);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const fetchCompany = async () => {
    setLoading(true);
    await getCompanyProfile(companyId)
      .then((response) => {
        setCompany(response);
      })
      .catch((error) => {
        console.log(error);
      }).finally(()=>{
        setLoading(false);
      });
  };

  const fetchJobs = async () => {
    setLoading(true);
    await getPagedJobs({
      PageIndex: pagination.pageIndex,
      PageSize: pagination.pageSize,
      search: searchQuery,
      recruiterId: company?.recruiterId,
    })
      .then((response) => {
        setJobs(response.data || []);
        setPagination({
          ...pagination,
          pageCount: response.totalPages,
          totalRecords: response.totalRecords,
        });
      })
      .catch((error) => {
        console.log(error);
      }).finally(()=>{
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCompany();
  }, [companyId]);

  useEffect(() => {
    fetchJobs();
  }, [company?.recruiterId, searchQuery, pagination.pageIndex, pagination.pageSize]);

  if (loading) return <LoadingSpinner/>

  return (
    <div className="flex px-16 py-8 bg-slate-200 flex-grow flex-col gap-4">
      <div className="p-6 bg-white rounded-lg w-full gap-4 flex">
        <div className="rounded-full overflow-hidden h-32 w-32 shadow-md flex items-center justify-center">
          <img src={company?.imageUrl} alt="" className="" />
        </div>
        <div className="flex flex-col justify-end gap-4 ml-6">
          <div className="text-4xl font-bold">{company?.name}</div>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <FaGlobe size={20} />
              <Link
                to={
                  company?.website.startsWith("http://") ||
                  company?.website.startsWith("https://")
                    ? company?.website
                    : `https://${company?.website}`
                }
                target="_blank"
                className="text-blue-600 underline"
              >
                {company?.website}
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <BsBuildingsFill size={20} />
              {company?.size} employees
            </div>
          </div>
        </div>
      </div>
      <div className=" bg-white rounded-lg w-full overflow-hidden">
        <div className="bg-[#ef4545] px-6 py-4 text-white font-semibold text-xl">
          Company Description
        </div>
        <div className="px-6 py-4">{company?.description}</div>
      </div>
      <div className=" bg-white rounded-lg w-full overflow-hidden">
        <div className="bg-[#ef4545] px-6 py-4 text-white font-semibold text-xl">
          Recruitments
        </div>
        <div className="px-6 py-4">
          <SearchForm
            setSearch={(query) => {
              setSearchQuery(query);
              setPagination({ ...pagination, pageIndex: 1 });
            }}
            onSubmit={fetchJobs}
          />
          <div className="flex flex-wrap mt-2 gap-2">
            {jobs?.map((job, index) => (
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
        </div>
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
}

export default CompanyProfile;
