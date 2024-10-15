import { useEffect, useState } from "react";
import { ImNewTab } from "react-icons/im";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import header from "../../../assets/images/1699539921842.jfif";
import { FormatDateTime } from "../../../common/helpers";
import { useAuth } from "../../../hooks/useAuth";
import { useLoading } from "../../../hooks/useLoading";
import { changeApplicationStatus, getApplications } from "../../../services/job";

const DashBoard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const {setIsLoading, isLoading} = useLoading();

  const fetchApplications = async () => {
    setIsLoading(true);
    await getApplications({
      recruiterId: user.id,
      pageSize: 5,
      pageIndex: 1,
    })
      .then((response) => {
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
  }, [user]);

  return (
    <div className="p-4  flex flex-col flex-grow">
      <div className="relative h-[300px] flex items-center justify-center flex-col">
        <div className="absolute w-full h-full opacity-70 top-0  flex justify-center items-center overflow-hidden -z-10 ">
          <img src={header} alt="" className="w-full" />
        </div>
        <div className="font-bold text-4xl sm:text-5xl md:text-7xl  font-serif text-center">
          FIND THE BEST CANDIDATES EFFECTIVELY
        </div>
        <div className="bg-black w-[300px] md:w-[500px] h-2 mt-1">
          .
        </div>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="mb-2 font-semibold text-xl">Recent Applications</div>
        <Link to={"/recruiters/jobs"} className=" text-blue-600 underline">See all</Link>
      </div>
      
      <div className="w-full overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                Job
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                Phone number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                Applied at
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                Cover Letter
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                CV
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
                    navigate(`/recruiters/jobs/${app.job.id}`)
                  }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-ellipsis overflow-hidden max-w-[400px]">
                    {app.job.title}
                  </td>
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
                    {FormatDateTime(app.appliedAt, "mm-dd-yyyy hh:mm:ss")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 underline">
                    <span
                      onClick={() => {
                        setOpenCoverLetter(true);
                        if (app.coverLetter) setCoverLetter(app.coverLetter);
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
    </div>
  );
};

export default DashBoard;
