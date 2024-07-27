import { useNavigate } from "react-router-dom";
import { Button } from "../../../../components/Button";

export const Jobs = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div>
        <Button
          variant={"red"}
          onClick={() => navigate("/recruiters/jobs/create")}
        >
          Create a new Job
        </Button>
      </div>
    </div>
  );
};
