import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { COMPANY_STATUS } from "../../../common/constant";
import { Button } from "../../../components/Button";
import { Dialog } from "../../../components/Dialog";
import { Pagination } from "../../../components/Pagination";
import { useAuth } from "../../../hooks/useAuth";
import { FormatDateTime } from "../../../lib";
import {
  approveCompanyProfile,
  getPagedCompanyProfiles,
  rejectCompanyProfile,
} from "../../../services/admin";
import { getRecruiter } from "../../../services/recruiter";

export const CompanyProfiles = () => {
  const [companyProfiles, setCompanyProfiles] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageCount: 0,
    pageSize: 10,
    totalRecords: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const navigate = useNavigate();
  const { user } = useAuth();
  const [openApprove, setOpenApprove] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  const [companyId, setCompanyId] = useState();
  const [profileDetails, setProfileDetails] = useState();
  const [openDetails, setOpenDetails] = useState(false);

  const fetchCompanyProfiles = () => {
    getPagedCompanyProfiles({
      PageIndex: pagination.pageIndex,
      PageSize: pagination.pageSize,
      search: searchQuery,
      orderBy: sortConfig.key,
      isDescending: sortConfig.direction === "descending",
    })
      .then((response) => {
        setCompanyProfiles(response.data || []);
        setPagination({
          ...pagination,
          pageCount: response.totalPages,
          totalRecords: response.totalRecords,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchRecruiter = () => {
    if (profileDetails?.recruiterId) {
      console.log(234);
      getRecruiter(profileDetails.recruiterId).then((response) => {
        setProfileDetails((prev) => ({
          ...prev,
          recruiter: response,
        }));
      });
    }
  };
  console.log(profileDetails);

  useEffect(() => {
    fetchCompanyProfiles();
  }, [pagination.pageIndex, pagination.pageSize, searchQuery, sortConfig]);

  useEffect(() => {
    fetchRecruiter();
  }, [profileDetails?.id])

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

  const handleApprove = () => {
    approveCompanyProfile({
      companyId,
      adminId: user.id,
    })
      .then(() => {
        fetchCompanyProfiles();
        toast.success("Profile approved.");
      })
      .catch((err) => {
        toast.error("Error approving profile. Please check console.");
        console.log(err);
      });
  };

  const handleReject = () => {
    rejectCompanyProfile({
      companyId,
      adminId: user.id,
    })
      .then(() => {
        fetchCompanyProfiles();
        toast.success("Profile rejected.");
      })
      .catch((err) => {
        toast.error("Error approving profile. Please check console.");
        console.log(err);
      });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4 flex justify-between items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Search company"
            value={searchQuery}
            onChange={handleSearch}
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      <div className="bg-white shadow-lg rounded-lg overflow-auto border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                onClick={() => handleSort("name")}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              >
                Company name{" "}
                {sortConfig.key === "name" &&
                  (sortConfig.direction === "ascending" ? "▲" : "▼")}
              </th>
              <th
                onClick={() => handleSort("size")}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              >
                Size{" "}
                {sortConfig.key === "size" &&
                  (sortConfig.direction === "ascending" ? "▲" : "▼")}
              </th>
              <th
                onClick={() => handleSort("website")}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              >
                Website{" "}
                {sortConfig.key === "website" &&
                  (sortConfig.direction === "ascending" ? "▲" : "▼")}
              </th>
              <th
                onClick={() => handleSort("status")}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              >
                Status{" "}
                {sortConfig.key === "status" &&
                  (sortConfig.direction === "ascending" ? "▲" : "▼")}
              </th>
              <th
                onClick={() => handleSort("requestedAt")}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              >
                Requested at{" "}
                {sortConfig.key === "requestedAt" &&
                  (sortConfig.direction === "ascending" ? "▲" : "▼")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {companyProfiles.length > 0 ? (
              companyProfiles.map((profile, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:cursor-pointer`}
                  onClick={() => {
                    setOpenDetails(true);
                    setProfileDetails(profile);
                    fetchRecruiter();
                  }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {profile.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {profile.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {profile.website}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {
                      COMPANY_STATUS.find(
                        (status) => profile.status === status.value
                      )?.label
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {FormatDateTime(profile.requestedAt, "mm-dd-yyyy hh:mm:ss")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button
                      variant={"green"}
                      className="mr-2"
                      onClick={() => {
                        setOpenApprove(true);
                        setCompanyId(profile.id);
                      }}
                      disabled={profile.status !== 0}
                    >
                      Approve
                    </Button>
                    <Button
                      variant={"red"}
                      onClick={() => {
                        setOpenReject(true);
                        setCompanyId(profile.id);
                      }}
                      disabled={profile.status !== 0}
                    >
                      Reject
                    </Button>
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
      </div>
      <div className="mt-4">
        <Pagination
          {...pagination}
          setPage={(page) => {
            setPagination({ ...pagination, pageIndex: page });
          }}
        />
      </div>
      <Dialog
        open={openApprove}
        setOpen={setOpenApprove}
        onConfirm={handleApprove}
        description={"Do you want to approve this company profile?"}
      />
      <Dialog
        open={openReject}
        setOpen={setOpenReject}
        onConfirm={handleReject}
        description={"Do you want to reject this company profile?"}
      />
      <Dialog open={openDetails} setOpen={setOpenDetails}>
        <div>
          <table className="w-[400px]">
            <tbody>
              <tr>
                <td className="w-[150px]">Name</td>
                <td>{profileDetails?.name}</td>
              </tr>
              <tr>
                <td>Size</td>
                <td>{profileDetails?.size}</td>
              </tr>
              <tr>
                <td>Website</td>
                <td>
                  <a
                    href={profileDetails?.website}
                    className="text-blue-600 underline"
                  >
                    {profileDetails?.website}
                  </a>
                </td>
              </tr>
              <tr>
                <td>Status</td>
                <td>
                  {
                    COMPANY_STATUS.find(
                      (status) => profileDetails?.status === status.value
                    )?.label
                  }
                </td>
              </tr>
              <tr>
                <td>Requested at</td>
                <td>{profileDetails?.requestedAt}</td>
              </tr>
            </tbody>
          </table>
          <div>Requested by</div>
          <table className="w-[400px]">
            <tbody>
              <tr>
                <td className="w-[150px]">Name</td>
                <td>{profileDetails?.recruiter?.name}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{profileDetails?.recruiter?.email}</td>
              </tr>
              <tr>
                <td>Phone number</td>
                <td>{profileDetails?.recruiter?.phoneNumber}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Dialog>
    </div>
  );
};
