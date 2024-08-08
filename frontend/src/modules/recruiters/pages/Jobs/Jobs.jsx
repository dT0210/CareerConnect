import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { JOB_TYPES } from "../../../../common/constant";
import { FormatDateTime } from "../../../../common/helpers";
import { Button } from "../../../../components/Button";
import { LoadingSpinner } from "../../../../components/LoadingSpinner";
import { Pagination } from "../../../../components/Pagination";
import { useAuth } from "../../../../hooks";
import { useLoading } from "../../../../hooks/useLoading";
import { getPagedJobs } from "../../../../services/job";

export const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageCount: 0,
    pageSize: 10,
    totalRecords: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [jobDetails, setJobDetails] = useState();
  const [openDetails, setOpenDetails] = useState(false);
  const navigate = useNavigate();
  const { isLoading, setIsLoading } = useLoading();
  const { user } = useAuth();

  const fetchJobs = async () => {
    setIsLoading(true);
    // if (user.id === "") return;
    await getPagedJobs({
      PageIndex: pagination.pageIndex,
      PageSize: pagination.pageSize,
      recruiterId: user.id,
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
        toast.error("Error fetching jobs. Check console for details.");
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
    searchQuery,
    sortConfig,
    user,
  ]);

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPagination({ ...pagination, pageIndex: 1 });
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="p-8 w-full overflow-auto">
      <div>
        <Button
          variant={"red"}
          onClick={() => navigate("/recruiters/jobs/create")}
        >
          Create a new Job
        </Button>
      </div>
      <div className="w-full overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                onClick={() => handleSort("title")}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              >
                Job title{" "}
                {sortConfig.key === "title" &&
                  (sortConfig.direction === "ascending" ? "▲" : "▼")}
              </th>
              <th
                onClick={() => handleSort("field")}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              >
                Field{" "}
                {sortConfig.key === "field" &&
                  (sortConfig.direction === "ascending" ? "▲" : "▼")}
              </th>
              <th
                onClick={() => handleSort("location")}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              >
                Location{" "}
                {sortConfig.key === "location" &&
                  (sortConfig.direction === "ascending" ? "▲" : "▼")}
              </th>
              <th
                onClick={() => handleSort("type")}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              >
                Type{" "}
                {sortConfig.key === "type" &&
                  (sortConfig.direction === "ascending" ? "▲" : "▼")}
              </th>
              <th
                onClick={() => handleSort("createdAt")}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              >
                Created at{" "}
                {sortConfig.key === "createdAt" &&
                  (sortConfig.direction === "ascending" ? "▲" : "▼")}
              </th>
              <th
                onClick={() => handleSort("deadline")}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              >
                Deadline{" "}
                {sortConfig.key === "deadline" &&
                  (sortConfig.direction === "ascending" ? "▲" : "▼")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                Applications
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {jobs.length > 0 ? (
              jobs.map((job, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:cursor-pointer`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-ellipsis overflow-hidden max-w-[400px]">
                    {job.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {job.field.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {job.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {JOB_TYPES.find((type) => job.type === type.value)?.label}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {FormatDateTime(job.createdAt, "mm-dd-yyyy hh:mm:ss")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {FormatDateTime(job.deadline, "mm-dd-yyyy hh:mm:ss")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {job.applications}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                    <Link to={job.id} target="_blank"><Button variant={"blue"}>Details</Button></Link>
                    <Button variant={"green"}>Edit</Button>
                    <Button variant={"red"}>Delete</Button>
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
  );
};
