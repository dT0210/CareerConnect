import { useEffect, useState } from "react";
import { FaHourglass, FaSuitcase } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { GiPayMoney } from "react-icons/gi";
import { ImNewTab } from "react-icons/im";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { JOB_TYPES } from "../../../../common/constant";
import { FormatDateTime } from "../../../../common/helpers";
import { Button } from "../../../../components/Button";
import { Dialog } from "../../../../components/Dialog";
import { LoadingSpinner } from "../../../../components/LoadingSpinner";
import { Pagination } from "../../../../components/Pagination";
import { useAuth } from "../../../../hooks";
import { useLoading } from "../../../../hooks/useLoading";
import {
  changeApplicationStatus,
  getApplications,
} from "../../../../services/job";

export const JobsApplications = () => {
  const { jobId } = useParams();
  const { user } = useAuth();
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageCount: 0,
    pageSize: 10,
    totalRecords: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [applications, setApplications] = useState([]);
  const { isLoading, setIsLoading } = useLoading();
  const [job, setJob] = useState();
  const [openCoverLetter, setOpenCoverLetter] = useState(false);
  const [coverLetter, setCoverLetter] = useState(
    "This Application doesnt have a cover letter"
  );

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const fetchApplications = async () => {
    setIsLoading(true);
    await getApplications({
      jobId,
      pageSize: pagination.pageSize,
      pageIndex: pagination.pageIndex,
      orderBy: sortConfig.key,
      search: searchQuery,
      isDescending: sortConfig.direction === "descending",
    })
      .then((response) => {
        setJob(response.data[0]?.job);
        setApplications(response.data);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Trouble fetching applications");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchApplications();
  }, [jobId]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="w-full flex flex-col px-16 py-8 bg-slate-200 flex-grow gap-4">
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
        <div className="text-2xl font-bold">Applications</div>
        <div>
          <div className="w-full overflow-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    onClick={() => handleSort("name")}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  >
                    Name{" "}
                    {sortConfig.key === "name" &&
                      (sortConfig.direction === "ascending" ? "▲" : "▼")}
                  </th>
                  <th
                    onClick={() => handleSort("email")}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  >
                    Email{" "}
                    {sortConfig.key === "email" &&
                      (sortConfig.direction === "ascending" ? "▲" : "▼")}
                  </th>
                  <th
                    onClick={() => handleSort("phoneNumber")}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  >
                    Phone number{" "}
                    {sortConfig.key === "phoneNumber" &&
                      (sortConfig.direction === "ascending" ? "▲" : "▼")}
                  </th>
                  <th
                    onClick={() => handleSort("address")}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  >
                    Address{" "}
                    {sortConfig.key === "address" &&
                      (sortConfig.direction === "ascending" ? "▲" : "▼")}
                  </th>
                  <th
                    onClick={() => handleSort("appliedAt")}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  >
                    Applied at{" "}
                    {sortConfig.key === "appliedAt" &&
                      (sortConfig.direction === "ascending" ? "▲" : "▼")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                    Cover Letter
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                    CV
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.length > 0 ? (
                  applications.map((app, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:cursor-pointer`}
                      onClick={() => {
                        if (app.status === 0) {
                          changeApplicationStatus(app.id, 1)
                            .catch((error) => {
                              console.log(error);
                            })
                            .finally(() => {
                              fetchApplications();
                            });
                        }
                      }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-ellipsis overflow-hidden max-w-[400px]">
                        {app.candidate.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {app.candidate.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {app.candidate.phoneNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {app.candidate.address}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {FormatDateTime(app.appliedAt, "mm-dd-yyyy hh:mm:ss")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 underline">
                        <span
                          onClick={() => {
                            setOpenCoverLetter(true);
                            if (app.coverLetter)
                              setCoverLetter(app.coverLetter);
                          }}
                        >
                          Open
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <Link
                          to={app.cvUrl}
                          target="_blank"
                          className="text-blue-600 underline flex items-center gap-1"
                        >
                          Open <ImNewTab />
                        </Link>
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                        <Button variant={"green"}>Suitable</Button>
                        <Button variant={"red"}>Not Suitable</Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                    >
                      No result
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <Pagination
              {...pagination}
              setPage={(page) => {
                setPagination({ ...pagination, pageIndex: page });
              }}
            />
          </div>
        </div>
      </div>
      <Dialog open={openCoverLetter} setOpen={setOpenCoverLetter}>
        <div className="md:w-[500px] max-h-[500px] overflow-auto whitespace-pre-line">
          {coverLetter}
        </div>
      </Dialog>
    </div>
  );
};
