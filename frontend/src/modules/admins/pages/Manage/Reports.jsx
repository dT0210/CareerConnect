import { useEffect, useState } from "react";
import { REPORT_STATUS } from "../../../../common/constant";
import { Dialog } from "../../../../components/Dialog";
import { LoadingSpinner } from "../../../../components/LoadingSpinner";
import { Pagination } from "../../../../components/Pagination";
import { SearchForm } from "../../../../components/SearchForm";
import { Select } from "../../../../components/Select";
import { useLoading } from "../../../../hooks/useLoading";
import { getReports } from "../../../../services/admin";
import ReportDetails from "../../components/ReportDetails";

export const Reports = () => {
  const [reports, setReports] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageCount: 0,
    pageSize: 10,
    totalRecords: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const { isLoading, setIsLoading } = useLoading();
  const [reportId, setReportId] = useState(null);
  const [openReportDetails, setOpenReportDetails] = useState(false);
  const [status, setStatus] = useState(null);

  const fetchReports = async () => {
    setIsLoading(true);
    await getReports({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      search: searchQuery,
      orderBy: sortConfig.key,
      isDescending: sortConfig.direction === "descending",
      status
    })
      .then((response) => {
        setReports(response.data || []);
        setPagination({
          ...pagination,
          pageCount: response.totalPages,
          totalRecords: response.totalRecords,
        });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchReports();
  }, [sortConfig, searchQuery, pagination.pageIndex, pagination.pageSize, status]);

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4 flex justify-between items-center">
        <SearchForm
          setSearch={(query) => {
            setSearchQuery(query);
            setPagination({ ...pagination, pageIndex: 1 });
          }}
          onSubmit={fetchReports}
        />
        <Select
          options={REPORT_STATUS}
          label={"Status"}
          onChange={(option) => {
            setStatus(option?.value);
          }}
          defaultValue={status}
          className={"w-[30%]"}
        />
      </div>
      <div className="bg-white shadow-lg rounded-lg overflow-auto border border-gray-200">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  onClick={() => handleSort("title")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  Job Title{" "}
                  {sortConfig.key === "title" &&
                    (sortConfig.direction === "ascending" ? "▲" : "▼")}
                </th>
                <th
                  onClick={() => handleSort("company")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  Company{" "}
                  {sortConfig.key === "company" &&
                    (sortConfig.direction === "ascending" ? "▲" : "▼")}
                </th>
                <th
                  onClick={() => handleSort("reporter")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  User Reported{" "}
                  {sortConfig.key === "reporter" &&
                    (sortConfig.direction === "ascending" ? "▲" : "▼")}
                </th>
                <th
                  onClick={() => handleSort("email")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  User email{" "}
                  {sortConfig.key === "reporter" &&
                    (sortConfig.direction === "ascending" ? "▲" : "▼")}
                </th>

                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comment
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.length > 0 ? (
                reports.map((report, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:cursor-pointer`}
                    onClick={() => {
                      setOpenReportDetails(true);
                      setReportId(report.id);
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.job.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.job.recruiter.company.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.candidate.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.candidate.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 overflow-ellipsis overflow-hidden max-w-[200px]">
                      {report.candidateComment}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 overflow-ellipsis overflow-hidden max-w-[200px]">
                      {
                        REPORT_STATUS.find((r) => r.value === report.status)
                          .label
                      }
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                  >
                    No result
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      <div className="mt-4">
        <Pagination
          {...pagination}
          setPage={(page) => {
            setPagination({ ...pagination, pageIndex: page });
          }}
        />
      </div>
      <Dialog open={openReportDetails} setOpen={setOpenReportDetails}>
        <ReportDetails
          reportId={reportId}
          setOpen={setOpenReportDetails}
          onUpdate={() => {
            fetchReports();
          }}
        />
      </Dialog>
    </div>
  );
};
