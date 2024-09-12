import { useState } from "react";
import { CiWarning } from "react-icons/ci";
import { FaHourglass, FaSuitcase } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { GiPayMoney } from "react-icons/gi";
import { useParams } from "react-router-dom";
import { JOB_TYPES } from "../../../../common/constant";
import { ApplicationsTable } from "../../components/ApplicationsTable";

export const JobsApplications = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState();

  return (
    <div className="w-full flex flex-col px-16 py-8 bg-slate-200 flex-grow gap-4">
      {job?.isDeleted && (
        <div className="p-4 bg-white rounded-lg w-full flex items-center gap-2">
          {" "}
          <CiWarning size={30} color="#ef4444"/>
          This job has been deleted.
        </div>
      )}
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
      </div>
      <div className="p-4 bg-white rounded-lg w-full">
        <div className="text-2xl font-bold">Job Description</div>
        <div>{job?.description || "None given"}</div>
      </div>
      <div className="p-4 bg-white rounded-lg">
        <ApplicationsTable jobId={jobId} setJob={setJob} />
      </div>
    </div>
  );
};
