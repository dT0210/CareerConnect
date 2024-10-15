import { useEffect, useState } from "react";
import { LoadingSpinner } from "../../../components/LoadingSpinner";
import { Pagination } from "../../../components/Pagination";
import { SearchForm } from "../../../components/SearchForm";
import { getFieldsStatistic } from "../../../services/admin";

function Statistic() {
  const [statistic, setStatistic] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageCount: 0,
    pageSize: 10,
    totalRecords: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [loading, setLoading] = useState(false);

  const fetchStatistic = () => {
    setLoading(true);
    getFieldsStatistic({
      PageIndex: pagination.pageIndex,
      PageSize: pagination.pageSize,
      search: searchQuery,
      orderBy: sortConfig.key,
      isDescending: sortConfig.direction === "descending",
    })
      .then((response) => {
        setStatistic(response.data || []);
        setPagination({
          ...pagination,
          pageCount: response.totalPages,
          totalRecords: response.totalRecords,
        });
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    fetchStatistic();
  }, [pagination.pageIndex, pagination.pageSize, searchQuery, sortConfig]);

  return (
    <div className=" p-8 flex flex-col flex-grow">
      <div className="mb-4 flex justify-between items-center">
        <SearchForm
          setSearch={(query) => {
            setSearchQuery(query);
            setPagination({ ...pagination, pageIndex: 1 });
          }}
          onSubmit={fetchStatistic}
        />
      </div>
      <div className="bg-white shadow-lg rounded-lg overflow-auto border border-gray-200">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  onClick={() => handleSort("name")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  Field name{" "}
                  {sortConfig.key === "name" &&
                    (sortConfig.direction === "ascending" ? "▲" : "▼")}
                </th>
                <th
                  onClick={() => handleSort("jobCount")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  Job Count{" "}
                  {sortConfig.key === "jobCount" &&
                    (sortConfig.direction === "ascending" ? "▲" : "▼")}
                </th>
                <th
                  onClick={() => handleSort("applicationCount")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  Application Count{" "}
                  {sortConfig.key === "applicationCount" &&
                    (sortConfig.direction === "ascending" ? "▲" : "▼")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {statistic.length > 0 ? (
                statistic.map((record, index) => (
                  <tr
                    key={index}
                    className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.jobCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.applicationCount}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
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
    </div>
  );
}

export default Statistic;
