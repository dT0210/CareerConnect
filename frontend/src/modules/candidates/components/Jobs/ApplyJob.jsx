import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../../../../components/Button";
import InputField from "../../../../components/InputField";
import { getCandidateDetails } from "../../../../services/candidate";
import { applyJob } from "../../../../services/job";

export const ApplyJob = ({ jobId, candidateId, onSubmit }) => {
  const [candidate, setCandidate] = useState();
  const [coverLetter, setCoverLetter] = useState("");

  useEffect(() => {
    const fetchCandidate = async () => {
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

  const handleSubmit = async () => {
    await applyJob({
      jobId,
      candidateId,
      coverLetter,
    })
      .then((response) => {
        toast.success("Applied successfully");
      })
      .catch((err) => {
        toast.error("Trouble applying for this job");
      })
      .finally(() => {
        if (onSubmit) onSubmit();
      });
  };

  return (
    <div>
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
      <div className="flex justify-center mt-4">
        <Button variant={"red"} onClick={handleSubmit}>
          Apply
        </Button>
      </div>
    </div>
  );
};
