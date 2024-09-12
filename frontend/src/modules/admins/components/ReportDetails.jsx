import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { REPORT_STATUS } from "../../../common/constant";
import { Button } from "../../../components/Button";
import { Dialog } from "../../../components/Dialog";
import { Select } from "../../../components/Select";
import { useLoading } from "../../../hooks/useLoading";
import { getReportById, updateReportStatus } from "../../../services/admin";
import { deleteJob } from "../../../services/job";

function ReportDetails({ reportId, setOpen, onUpdate }) {
  const [report, setReport] = useState(null);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const { isLoading, setIsLoading } = useLoading();
  const fetchReportDetails = () => {
    setIsLoading(true);
    getReportById(reportId)
      .then((response) => {
        setReport(response);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchReportDetails();
  }, [reportId]);

  const handleDelete = () => {
    deleteJob(report.job.id)
      .then(() => {
        toast.success("Job deleted");
      })
      .catch((error) => {
        toast.error(error.response.data);
        console.log(error);
      })
      .finally(() => {
        setOpen && setOpen(false);
      });
  };

  const handleUpdateReportStatus = (id, status) => {
    setIsLoading(true);
    updateReportStatus(id, status).then(()=>{
      onUpdate();
    })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // if (isLoading) return <LoadingSpinner/>

  return (
    <div className="sm:w-[600px] ">
      <div>
        <table>
          <tbody>
            <tr>
              <td className="font-semibold w-[200px]">Job Title</td>
              <td>{report?.job.title}</td>
            </tr>
            <tr>
              <td className="font-semibold">Company</td>
              <td>{report?.job.recruiter.company.name}</td>
            </tr>
            <tr>
              <td></td>
              <td>
                <img
                  src={report?.job.recruiter.company.imageUrl}
                  alt=""
                  className="w-20 h-20"
                />
              </td>
            </tr>
            <tr>
              <td className="font-semibold">Job Link</td>
              <td>
                <Link
                  to={`/admin/jobs/${report?.job.id}`}
                  className="text-blue-600 underline"
                  target="_blank"
                >
                  {report?.job.title} - {report?.job.recruiter.company.name}
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="font-semibold italic">Reported by</div>
      <div>
        <table>
          <tbody>
            <tr>
              <td className="font-semibold w-[200px]">Name</td>
              <td>{report?.candidate.name}</td>
            </tr>
            <tr>
              <td className="font-semibold">Email</td>
              <td>{report?.candidate.email}</td>
            </tr>
            <tr>
              <td className="font-semibold">Phone number</td>
              <td>{report?.candidate.phoneNumber}</td>
            </tr>
            <tr>
              <td className="font-semibold">Address</td>
              <td>{report?.candidate.address}</td>
            </tr>
            <tr>
              <td className="font-semibold">Content</td>
              <td>
                <div className="max-h-[200px] overflow-auto">
                  {report?.candidateComment}
                </div>
              </td>
            </tr>
            <tr>
              <td className="font-semibold">Status</td>
              <td>
                <div className="max-h-[200px]">
                  <Select
                    options={REPORT_STATUS}
                    label={"Status"}
                    onChange={(option) => {
                      handleUpdateReportStatus(report?.id, option?.value);
                    }}
                    defaultValue={report?.status}
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex mt-2 items-center justify-center gap-2">
        <Button
          variant={"red"}
          onClick={() => {
            setOpenConfirmDelete(true);
          }}
        >
          Delete job
        </Button>
        <Button
          onClick={() => {
            setOpen(false);
          }}
        >
          Cancel
        </Button>
      </div>
      <Dialog
        open={openConfirmDelete}
        setOpen={setOpenConfirmDelete}
        onConfirm={handleDelete}
        description={"Are you sure you want to delete this job"}
      ></Dialog>
    </div>
  );
}

export default ReportDetails;
