import { useEffect, useState } from "react";
import { FaSuitcase } from "react-icons/fa";
import { FaHourglass, FaLocationDot } from "react-icons/fa6";
import { GiPayMoney } from "react-icons/gi";
import { IoPeople } from "react-icons/io5";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { JOB_TYPES } from "../../../../common/constant";
import { Button } from "../../../../components/Button";
import { LoadingSpinner } from "../../../../components/LoadingSpinner";
import { useAuth } from "../../../../hooks";
import { useLoading } from "../../../../hooks/useLoading";
import { getJobById } from "../../../../services/job";
import { useAppliedJobs } from "../../hooks/useAppliedJobs";

export const JobDetails = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState();
  const { isLoading, setIsLoading } = useLoading();
  const { user } = useAuth();
  const { appliedJobs, fetchAppliedJobs } = useAppliedJobs(user.id, 1000000);

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
    <div className="flex px-16 py-8 bg-slate-200 h-full justify-between">
      <div className="w-3/5 flex flex-col gap-4">
        <div className="p-4 bg-white rounded-lg w-full flex flex-col gap-4">
          <div className="text-3xl font-bold">{job?.title}</div>
          <div className="flex justify-between">
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
              <FaSuitcase size={32}/>
              </div>
              <div>
                <div>Type</div>
                <div className="font-semibold">{JOB_TYPES.find(type=>type.value === job?.type).label }</div>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              variant={"red"}
              disabled={appliedJobs.find(
                (appliedJob) => appliedJob.id === job.id
              )}
            >
              Apply
            </Button>
          </div>
        </div>
        <div className="p-4 bg-white rounded-lg w-full">
          <div className="text-2xl font-bold">Job Description</div>
          <div>{job?.description}</div>
        </div>
      </div>
      <div className="w-[38%]">
        <div className="bg-white rounded-lg p-4">
          <div className="flex gap-4">
            <div className="h-24 w-24">
              <img
                src={job?.recruiter.company.imageUrl}
                alt=""
                className="w-full h-full object-cover border-[1px] border-slate-200 p-2 rounded-md"
              />
            </div>
            <div className="flex-shrink-0 font-semibold text-xl">
              {job?.recruiter.company.name}
            </div>
          </div>
          <div className="mt-4">
            <table className="font-medium">
              <tbody>
                <tr>
                  <td className="opacity-50 w-[100px] flex gap-2 items-center"><IoPeople /> Size:</td>
                  <td>{job?.recruiter.company.size}</td>
                </tr>
                <tr>
                  <td  className="opacity-50  flex gap-2 items-center"><FaLocationDot />Address:</td>
                  <td>{job?.recruiter.company.address}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
