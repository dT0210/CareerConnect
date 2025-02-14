import { useEffect, useState } from "react";
import { FaSuitcase } from "react-icons/fa";
import { FaHourglass, FaLocationDot } from "react-icons/fa6";
import { GiPayMoney } from "react-icons/gi";
import { IoPeople } from "react-icons/io5";
import { MdOutlineReport } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { JOB_TYPES } from "../../../../common/constant";
import { FormatDateTime } from "../../../../common/helpers";
import { Button } from "../../../../components/Button";
import { Dialog } from "../../../../components/Dialog";
import { LoadingSpinner } from "../../../../components/LoadingSpinner";
import { useAuth } from "../../../../hooks";
import { useLoading } from "../../../../hooks/useLoading";
import { getJobById } from "../../../../services/job";
import { ApplyJob } from "../../components/Jobs";
import JobReport from "../../components/Jobs/JobReport";
import { useAppliedJobs } from "../../hooks/useAppliedJobs";

export const JobDetails = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState();
  const { isLoading, setIsLoading } = useLoading();
  const { user } = useAuth();
  const { appliedJobs, fetchAppliedJobs } = useAppliedJobs(user.id, 1000000);
  const applyDisabled = appliedJobs.find(
    (appliedJob) => appliedJob.id === job?.id
  );

  const [openApplyJob, setOpenApplyJob] = useState(false);
  const [openReport, setOpenReport] = useState(false);

  const fetchJob = async () => {
    setIsLoading(true);
    await getJobById(jobId)
      .then((response) => {
        setJob(response);
      })
      .catch((err) => {
        toast.error("Trouble fetching job details");
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="relative flex px-16 py-8 bg-slate-200 flex-grow justify-between flex-wrap gap-4 md:gap-0">
      <div className="w-full md:w-3/5 flex flex-col gap-4">
        <div className="p-4 bg-white rounded-lg w-full flex flex-col gap-4">
          <div className="text-3xl font-bold">{job?.title}</div>
          <div className="flex justify-between flex-wrap">
            <div className="flex items-center gap-3">
              <div>
                <GiPayMoney size={32} />
              </div>
              <div>
                <div>Salary</div>
                <div className="font-semibold">{job?.salary}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div>
                <FaLocationDot size={32} />
              </div>
              <div>
                <div>Location</div>
                <div className="font-semibold">{job?.location}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div>
                <FaHourglass size={32} />
              </div>
              <div>
                <div>Experience</div>
                <div className="font-semibold">{job?.experience}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div>
                <FaSuitcase size={32} />
              </div>
              <div>
                <div>Type</div>
                <div className="font-semibold">
                  {JOB_TYPES.find((type) => type.value === job?.type)?.label}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              variant={"red"}
              disabled={applyDisabled}
              onClick={() => {
                setOpenApplyJob(true);
              }}
            >
              {applyDisabled ? "Applied" : "Apply"}
            </Button>
          </div>
          {applyDisabled && (
            <div className="flex justify-end italic text-sm">
              Applied at{" "}
              {FormatDateTime(applyDisabled.appliedAt, "dd/mm/yyyy hh:mm")}
            </div>
          )}
        </div>
        <div className="p-4 bg-white rounded-lg w-full">
          <div className="text-2xl font-bold">Job Description</div>
          <div>{job?.description || "None given"}</div>
        </div>
      </div>
      <div className="w-full md:w-[38%] flex flex-col gap-4">
        <div className="bg-white rounded-lg p-4">
          <div className="flex gap-4">
            <div className="h-24 w-24">
              <Link to={`/companies/${job?.recruiter.company.id}`}>
                <img
                  src={job?.recruiter.company.imageUrl}
                  alt=""
                  className="w-full h-full object-cover border-[1px] border-slate-200 p-2 rounded-md"
                />
              </Link>
            </div>
            <div className="flex-shrink-0 font-semibold text-xl">
              <Link to={`/companies/${job?.recruiter.company.id}`}>
                {job?.recruiter.company.name}
              </Link>
            </div>
          </div>
          <div className="mt-4">
            <table className="font-medium">
              <tbody>
                <tr>
                  <td className="opacity-50 w-[100px] flex gap-2 items-center">
                    <IoPeople /> Size:
                  </td>
                  <td>{job?.recruiter.company.size}</td>
                </tr>
                <tr>
                  <td className="opacity-50  flex gap-2 items-center">
                    <FaLocationDot />
                    Address:
                  </td>
                  <td>{job?.recruiter.company.address}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white rounded-lg px-4 py-3 flex flex-col gap-2">
          <div className="text-xl font-semibold">Other information</div>
          <div>
            <div>Field</div>
            <div className="px-2 py-1 bg-slate-200 flex items-center w-fit h-fit">
              {job?.field.name}
            </div>
          </div>
          <div>
            <div>Skills</div>
            <div className="flex gap-1">
              {job?.skills.map((skill) => (
                <a className="px-2 py-1 bg-slate-200 flex items-center h-fit w-fit">
                  {skill.name}
                </a>
              ))}
            </div>
          </div>
          <div>
            <div>Location</div>
            <div className="px-2 py-1 bg-slate-200 flex items-center h-fit w-fit">
              {job?.location}
            </div>
          </div>
        </div>
      </div>
      <div
        className="fixed bottom-4 right-16 rounded-full shadow-sm bg-white p-1 hover:cursor-pointer"
        onClick={() => {
          setOpenReport(true);
        }}
      >
        <MdOutlineReport size={40} color="#ef4444" />
      </div>
      <Dialog open={openReport} setOpen={setOpenReport}>
        <JobReport
          job={job}
          onSubmit={() => {
            setOpenReport(false);
          }}
        />
      </Dialog>
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
