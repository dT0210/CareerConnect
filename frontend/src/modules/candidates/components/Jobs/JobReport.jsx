import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../../../../components/Button";
import InputField from "../../../../components/InputField";
import { useAuth } from "../../../../hooks";
import { getCandidateDetails } from "../../../../services/candidate";
import { reportJob } from "../../../../services/job";

function JobReport({ job, onSubmit }) {
  const [formData, setFormData] = useState({
    comment: "",
  });
  const { user } = useAuth();
  const [candidateDetails, setCandidateDetails] = useState(null);
  const [error, setError] = useState(null);

  const validateForm = () => {
    if (formData.comment == "") {
        setError("Please provide us the details of what happened");
        return false;
    }
    return true;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    reportJob({
      candidateId: user.id,
      jobId: job.id,
      candidateComment: formData.comment,
    })
      .then(() => {
        toast.success("Report successfully");
        onSubmit && onSubmit();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchCandidate = async () => {
    await getCandidateDetails(user.id)
      .then((response) => {
        setCandidateDetails(response);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Trouble fetching candidate details");
      })
      .finally(() => {});
  };

  useEffect(() => {
    fetchCandidate();
  }, []);

  return (
    <div>
      <div className="font-bold text-xl mb-2">Report Job Recruitment</div>
      <form onSubmit={handleSubmit}>
        <table className="w-[500px]">
          <tbody>
            <tr>
              <td className="w-[150px] font-semibold">Job</td>
              <td className="text-wrap">
                {job?.title} - {job?.recruiter.company.name}
              </td>
            </tr>
            <tr>
              <td className="font-semibold">Full name</td>
              <td>{candidateDetails?.name}</td>
            </tr>
            <tr>
              <td className="font-semibold">Email</td>
              <td>{candidateDetails?.email}</td>
            </tr>
            <tr>
              <td className="font-semibold">Phone number</td>
              <td>{candidateDetails?.phoneNumber}</td>
            </tr>
            <tr>
              <td className="font-semibold">Address</td>
              <td>{candidateDetails?.address}</td>
            </tr>
            <tr>
              <td className="font-semibold">Comment</td>
              <td>
                <InputField
                  type={"textarea"}
                  placeholder={
                    "Please provide us every details so we can solve this issue as fast as possible"
                  }
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      comment: e.target.value,
                    }));
                  }}
                />
                <div className="text-sm italic text-red-500 text-right">
                    {error}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="flex items-center justify-center mt-2 gap-3">
          <Button variant={"red"} type={"submit"}>
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}

export default JobReport;
