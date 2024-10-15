import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../../../../components/Button";
import InputField from "../../../../components/InputField";
import { LoadingSpinner } from "../../../../components/LoadingSpinner";
import { getCandidateDetails } from "../../../../services/candidate";
import { uploadPdf } from "../../../../services/file";
import { applyJob } from "../../../../services/job";

export const ApplyJob = ({ jobId, candidateId, onSubmit }) => {
  
  const [candidate, setCandidate] = useState();
  const [coverLetter, setCoverLetter] = useState("");
  const [file, setFile] = useState();
  const [loading, setLoading ] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  useEffect(() => {
    const fetchCandidate = async () => {
      if (!candidateId) return;
      await getCandidateDetails(candidateId)
        .then((response) => {
          setCandidate(response);
        })
        .catch((err) => {
          toast.error("Trouble fetching candidate details");
          console.log(err);
        });
    };
    fetchCandidate();
  }, [candidateId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      setError(null);
      setLoading(true);
      await uploadPdf(candidateId, file)
        .then(async (response) => {
          await applyJob({
            jobId,
            candidateId,
            coverLetter,
            cvUrl: response.filePath,
          })
            .then((response) => {
              toast.success("Applied successfully");
            })
            .catch((err) => {
              toast.error("Trouble applying for this job");
              console.log(err);
            });
        })
        .finally(() => {
          if (onSubmit) onSubmit();
          setLoading(false);
        });
    } else {
setError("Please upload your CV")
    }
  };
  if (loading) return <LoadingSpinner/>
  return (
    <form>
      <div>
        <div className="font-bold text-xl">Your information</div>
        <table className="w-[400px]">
          <tr>
            <td className="font-medium">Full name</td>
            <td>{candidate?.name}</td>
          </tr>
          <tr>
            <td className="font-medium">Email</td>
            <td>{candidate?.email}</td>
          </tr>
          <tr>
            <td className="font-medium">Phone number</td>
            <td>{candidate?.phoneNumber}</td>
          </tr>
        </table>
      </div>
      <div>
        <div className="font-medium">Cover Letter</div>
        <InputField
          type={"textarea"}
          placeholder={"Tell the recruiter a little bit about yourself"}
          onChange={(e) => {
            setCoverLetter(e.target.value);
          }}
        />
      </div>
      <div>
      <div className="font-medium">Your CV</div>
        <InputField type="file" onChange={handleFileChange} inputClassName={"rounded-none"}/>
      </div>
      {error && <div className="text-red-600 italic text-sm text-right">{error}</div>}
      <div className="flex justify-center mt-4">
        <Button variant={"red"} onClick={handleSubmit}>
          Apply
        </Button>
      </div>
    </form>
  );
};
