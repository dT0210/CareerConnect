import { Button } from "../../../../components/Button";

export const JobCard = ({ job, onApplyClick, applyDisabled }) => {
  const handleApply = () => {
    if (onApplyClick !== null) onApplyClick();
  }
  
  return (
    <div className="flex shadow-md p-4 rounded gap-2 w-full md:w-[49%]">
      <div className="w-24 h-24 flex-shrink-0">
        <a href={`/jobs/${job.id}`} target="_blank">
          <img
            src={job.recruiter.company.imageUrl}
            alt="No Image"
            className="block h-full w-full object-contain"
          />
        </a>
      </div>
      <div className="overflow-hidden flex-grow">
        <div className="flex overflow-hidden justify-between">
          <div className="overflow-hidden">
            <div className="font-semibold text-xl overflow-hidden text-ellipsis text-nowrap">
              <a href={`/jobs/${job.id}`} target="_blank">
                {job.title}
              </a>
            </div>
            <div className="font-medium opacity-50 text-ellipsis overflow-hidden text-nowrap">
              {job.recruiter.company.name}
            </div>
          </div>
          <div className="ml-2 text-white py-1 px-2 rounded bg-green-400 font-medium h-fit">
            {job.salary}
          </div>
        </div>
        <div className="mt-1 flex justify-between">
          <div className="flex overflow-hidden gap-2">
          <a className="px-2 py-1 bg-slate-200 flex items-center">{job.location}</a>
          <a className="px-2 py-1 bg-slate-200 flex items-center">{job.field.name}</a>
            {job.skills.map((skill) => (
              <a className="px-2 py-1 bg-slate-200 flex items-center">{skill.name}</a>
            ))}
          </div>
          <div className="flex-shrink-0 flex">
            <button>{/*heart shaped react icon*/}</button>
            <Button onClick={handleApply} disabled={applyDisabled}>Apply</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
